import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/buttons/Button.jsx";
import { getSemester, editSemester } from "../../api/semester.api.js";
import { getSubjects, updateSubject } from "../../api/subject.api.js";

// ── Error banner ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) =>
    message ? (
        <div className="bg-[#FEF0F0] border border-[#FDDCDC] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E57373] shrink-0" />
            <p className="text-sm font-semibold text-[#C0392B]">{message}</p>
        </div>
    ) : null;

// ── Success banner ────────────────────────────────────────────────────────────
const SuccessBanner = ({ message }) =>
    message ? (
        <div className="bg-[#E6F7EF] border border-[#9FD9B8] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2E7D55] shrink-0" />
            <p className="text-sm font-semibold text-[#2E7D55]">{message}</p>
        </div>
    ) : null;

// ── Checkbox ──────────────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange, disabled }) => (
    <label
        className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
        <div className="relative shrink-0">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    checked
                        ? "bg-[#9B72F5] border-[#9B72F5]"
                        : "bg-[#F5F0FF] border-[#D0C4F0]"
                }`}
            >
                {checked && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path
                            d="M1 4L4 7L10 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
        </div>
        <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">
                Mark as current semester
            </p>
            <p className="text-xs text-[#8070AA]">
                This will be set as your active semester
            </p>
        </div>
    </label>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const EditSemesterPage = () => {
    const { semesterId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // ── Semester state ────────────────────────────────────────────────────────
    const [semesterName, setSemesterName] = useState("");
    const [isCurrent, setIsCurrent] = useState(false);
    const [semesterError, setSemesterError] = useState("");
    const [semesterSuccess, setSemesterSuccess] = useState("");

    // ── Subjects state ────────────────────────────────────────────────────────
    const [subjectStates, setSubjectStates] = useState({});
    const initializedRef = useRef(false);

    // ── Queries ───────────────────────────────────────────────────────────────
    const { data: semesterData, isLoading: semesterLoading } = useQuery({
        queryKey: ["semester", semesterId],
        queryFn: () => getSemester(semesterId),
    });

    const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
        queryKey: ["subjects", semesterId],
        queryFn: () => getSubjects(semesterId),
    });

    const isLoading = semesterLoading || subjectsLoading;

    // ── Sync semester data ────────────────────────────────────────────────────
    useEffect(() => {
        if (semesterData) {
            setSemesterName(semesterData.semesterName);
            setIsCurrent(semesterData.isCurrent);
        }
    }, [semesterData]);

    // ── Reset init when semester changes ──────────────────────────────────────
    useEffect(() => {
        initializedRef.current = false;
    }, [semesterId]);

    // ── Sync subjects ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (subjectsData && !initializedRef.current) {
            initializedRef.current = true;
            const initial = {};
            subjectsData.forEach((s) => {
                initial[s._id] = {
                    name: s.subjectName,
                    saving: false,
                    error: "",
                    success: "",
                };
            });
            setSubjectStates(initial);
        }
    }, [subjectsData]);

    // ── Mutations ─────────────────────────────────────────────────────────────
    const semesterMutation = useMutation({
        mutationFn: ({ semesterId, payload }) =>
            editSemester(semesterId, payload),
        onSuccess: () => {
            setSemesterSuccess("Semester updated");
            setSemesterError("");
            queryClient.invalidateQueries({ queryKey: ["semesters"] });
            queryClient.invalidateQueries({
                queryKey: ["semester", semesterId],
            });
            setTimeout(() => setSemesterSuccess(""), 3000);
        },
        onError: (err) => {
            setSemesterError(
                err?.response?.data?.message || "Failed to update semester",
            );
            setSemesterSuccess("");
        },
    });

    const subjectMutation = useMutation({
        mutationFn: ({ subjectId, formData }) =>
            updateSubject(subjectId, formData),
        onSuccess: (_, { subjectId }) => {
            setSubjectStates((prev) => ({
                ...prev,
                [subjectId]: {
                    ...prev[subjectId],
                    saving: false,
                    error: "",
                    success: "Saved",
                },
            }));
            queryClient.invalidateQueries({
                queryKey: ["subjects", semesterId],
            });
            setTimeout(() => {
                setSubjectStates((prev) => ({
                    ...prev,
                    [subjectId]: { ...prev[subjectId], success: "" },
                }));
            }, 3000);
        },
        onError: (err, { subjectId }) => {
            setSubjectStates((prev) => ({
                ...prev,
                [subjectId]: {
                    ...prev[subjectId],
                    saving: false,
                    error:
                        err?.response?.data?.message ||
                        "Failed to update subject",
                    success: "",
                },
            }));
        },
    });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSaveSemester = () => {
        setSemesterError("");
        setSemesterSuccess("");

        if (
            semesterName.trim() === semesterData?.semesterName &&
            isCurrent === semesterData?.isCurrent
        ) {
            setSemesterSuccess("No changes made");
            return;
        }

        const payload = {
            semesterName: semesterName.trim(),
            isCurrent,
        };

        semesterMutation.mutate({ semesterId, payload });
    };

    const handleSubjectNameChange = (subjectId, value) => {
        setSubjectStates((prev) => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                name: value,
                error: "",
                success: "",
            },
        }));
    };

    const handleSaveSubject = (subjectId) => {
        const subject = subjectStates[subjectId];
        if (!subject) return;

        if (!subject.name.trim()) {
            setSubjectStates((prev) => ({
                ...prev,
                [subjectId]: {
                    ...prev[subjectId],
                    error: "Subject name cannot be empty",
                },
            }));
            return;
        }

        setSubjectStates((prev) => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                saving: true,
                error: "",
                success: "",
            },
        }));

        const formData = new FormData();
        formData.append("subjectName", subject.name.trim());

        subjectMutation.mutate({ subjectId, formData });
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="w-full max-w-lg mx-auto pb-24">
                <div className="mb-4">
                    <div className="h-7 w-40 bg-[#E8E0F8] rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-56 bg-[#F0EBF8] rounded-lg animate-pulse" />
                </div>
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3"
                    >
                        <div className="h-3 w-24 bg-[#F0EBF8] rounded animate-pulse mb-4" />
                        <div className="h-10 bg-[#F5F0FF] rounded-xl animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    const subjectEntries = Object.entries(subjectStates);

    return (
        <div className="w-full max-w-lg mx-auto pb-24">
            {/* Header */}
            <div className="mb-4">
                <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    Edit semester
                </h1>
                <p className="text-sm text-[#8070AA] mt-1">
                    Changes are saved per section
                </p>
            </div>

            {/* ── Semester info ── */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Semester info
                </p>

                <ErrorBanner message={semesterError} />
                <SuccessBanner message={semesterSuccess} />

                <div className="flex flex-col gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            Semester name
                        </label>
                        <input
                            type="text"
                            value={semesterName}
                            onChange={(e) => setSemesterName(e.target.value)}
                            className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7]"
                            disabled={semesterMutation.isPending}
                        />
                    </div>

                    <Checkbox
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                        disabled={semesterMutation.isPending}
                    />
                </div>

                <div className="h-px bg-[#F0EBF8] mb-4" />

                <Button
                    onClick={handleSaveSemester}
                    disabled={semesterMutation.isPending}
                    className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold"
                    fullWidth
                >
                    {semesterMutation.isPending ? "Saving…" : "Save semester"}
                </Button>
            </div>

            {/* ── Subjects ── */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Subjects
                </p>

                {subjectEntries.length === 0 ? (
                    <p className="text-sm text-[#C4B0F7] text-center py-4">
                        No subjects in this semester
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {subjectEntries.map(([subjectId, state], i) => (
                            <div key={subjectId}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#C4B0F7] w-5 text-center shrink-0">
                                        {i + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={state.name}
                                        onChange={(e) =>
                                            handleSubjectNameChange(
                                                subjectId,
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleSaveSubject(subjectId)
                                        }
                                        className="flex-1 bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] placeholder:text-[#C4B0F7]"
                                        disabled={state.saving}
                                    />
                                    <button
                                        onClick={() =>
                                            handleSaveSubject(subjectId)
                                        }
                                        disabled={state.saving}
                                        className="shrink-0 bg-[#1A1A2E] text-white text-xs font-bold rounded-xl px-4 py-2.5 hover:bg-[#2d2d4e] transition-colors disabled:opacity-50"
                                    >
                                        {state.saving ? "…" : "Save"}
                                    </button>
                                </div>

                                {/* Per-subject feedback */}
                                {state.error && (
                                    <p className="text-xs font-semibold text-[#C0392B] mt-1.5 pl-7">
                                        {state.error}
                                    </p>
                                )}
                                {state.success && (
                                    <p className="text-xs font-semibold text-[#2E7D55] mt-1.5 pl-7">
                                        ✓ {state.success}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Back */}
            <Button
                onClick={() => navigate(-1)}
                className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                fullWidth
            >
                ← Back
            </Button>
        </div>
    );
};

export default EditSemesterPage;
