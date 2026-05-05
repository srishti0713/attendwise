import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/buttons/Button.jsx";
import { postSemester } from "../../api/semester.api.js";
import { addSubject } from "../../api/subject.api.js";

// ── Step indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
    <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((step) => {
            const done = current > step;
            const active = current === step;
            return (
                <div key={step} className="flex items-center gap-2">
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            done
                                ? "bg-[#9B72F5] text-white"
                                : active
                                  ? "bg-[#1A1A2E] text-white"
                                  : "bg-[#E8E0F8] text-[#8070AA]"
                        }`}
                    >
                        {done ? "✓" : step}
                    </div>
                    <span
                        className={`text-xs font-semibold ${
                            active ? "text-[#1A1A2E]" : "text-[#8070AA]"
                        }`}
                    >
                        {step === 1 ? "Semester" : "Subjects"}
                    </span>
                    {step < 2 && (
                        <div
                            className={`w-8 h-px ${done ? "bg-[#9B72F5]" : "bg-[#E2DBF0]"}`}
                        />
                    )}
                </div>
            );
        })}
    </div>
);

// ── Error banner ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) =>
    message ? (
        <div className="bg-[#FEF0F0] border border-[#FDDCDC] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E57373] flex-shrink-0" />
            <p className="text-sm font-semibold text-[#C0392B]">{message}</p>
        </div>
    ) : null;

// ── Main page ─────────────────────────────────────────────────────────────────
const AddSemesterPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Step 1 state
    const [step, setStep] = useState(1);
    const [semesterName, setSemesterName] = useState("");
    const [semesterId, setSemesterId] = useState(null);
    const [error, setError] = useState("");

    // Step 2 state
    const [subjects, setSubjects] = useState([{ id: 1, name: "" }]);
    const counterRef = useRef(1);

    // ── Subject helpers ───────────────────────────────────────────────────────

    const addSubjectRow = () => {
        counterRef.current += 1;
        setSubjects((prev) => [...prev, { id: counterRef.current, name: "" }]);
    };

    const removeSubjectRow = (id) => {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
    };

    const updateSubjectName = (id, value) => {
        setSubjects((prev) =>
            prev.map((s) => (s.id === id ? { ...s, name: value } : s)),
        );
    };

    // ── Mutations ─────────────────────────────────────────────────────────────

    const semesterMutation = useMutation({
        mutationFn: postSemester,
        onError: (err) => {
            setError(
                err?.response?.data?.message || "Failed to create semester",
            );
        },
    });

    const subjectMutation = useMutation({
        mutationFn: ({ formData, semesterId }) =>
            addSubject(formData, semesterId),
        onError: (err) => {
            setError(
                err?.response?.data?.message || "Failed to add a subject",
            );
        },
    });

    // ── Step 1: Create semester ───────────────────────────────────────────────

    const handleCreateSemester = async () => {
        setError("");

        const data = new FormData();
        data.append("semesterName", semesterName);

        try {
            const semester = await semesterMutation.mutateAsync(data);
            setSemesterId(semester._id);
            setStep(2);
        } catch {
            // error already handled in onError
        }
    };

    // ── Step 2: Add subjects then navigate ────────────────────────────────────

    const handleAddSubjects = async () => {
        setError("");

        const validSubjects = subjects.filter((s) => s.name.trim() !== "");

        for (const s of validSubjects) {
            const data = new FormData();
            data.append("subjectName", s.name.trim());

            try {
                await subjectMutation.mutateAsync({
                    semesterId,
                    formData: data,
                });
            } catch {
                // error already handled in onError; stop on first failure
                return;
            }
        }

        await queryClient.invalidateQueries({ queryKey: ["semesters"] });
        navigate("/");
    };

    const handleSkip = async () => {
        await queryClient.invalidateQueries({ queryKey: ["semesters"] });
        navigate("/");
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="w-full max-w-lg mx-auto pb-24">
            {/* Header */}
            <div className="mb-4">
                <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    {step === 1 ? "New semester" : "Add subjects"}
                </h1>
                <p className="text-sm text-[#8070AA] mt-1">
                    {step === 1
                        ? "Start by naming your semester"
                        : `Adding subjects to "${semesterName}"`}
                </p>
            </div>

            <StepIndicator current={step} />

            <ErrorBanner message={error} />

            {/* ── STEP 1 ── */}
            {step === 1 && (
                <>
                    <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                            Semester info
                        </p>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[#6B52B5]">
                                Semester name
                            </label>
                            <input
                                type="text"
                                value={semesterName}
                                onChange={(e) =>
                                    setSemesterName(e.target.value)
                                }
                                placeholder="e.g. Fall 2025, Semester 3…"
                                className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7]"
                                disabled={semesterMutation.isPending}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleCreateSemester()
                                }
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="h-px bg-[#F0EBF8] mb-3" />

                    <Button
                        onClick={handleCreateSemester}
                        disabled={semesterMutation.isPending}
                        className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold mb-3"
                        fullWidth
                    >
                        {semesterMutation.isPending
                            ? "Creating…"
                            : "Continue →"}
                    </Button>

                    <Button
                        onClick={() => navigate(-1)}
                        disabled={semesterMutation.isPending}
                        className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                        fullWidth
                    >
                        ← Back
                    </Button>
                </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
                <>
                    <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                            Subjects
                        </p>

                        {subjects.length === 0 ? (
                            <p className="text-sm text-[#C4B0F7] text-center py-4 mb-3">
                                No subjects yet — add one below
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2 mb-3">
                                {subjects.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-xs font-bold text-[#C4B0F7] w-5 text-center flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={s.name}
                                            onChange={(e) =>
                                                updateSubjectName(
                                                    s.id,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Subject name"
                                            className="flex-1 bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] placeholder:text-[#C4B0F7]"
                                            disabled={
                                                subjectMutation.isPending
                                            }
                                        />
                                        <button
                                            onClick={() =>
                                                removeSubjectRow(s.id)
                                            }
                                            disabled={
                                                subjectMutation.isPending
                                            }
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FEF0F0] text-[#E57373] hover:bg-[#FDDCDC] transition-colors flex-shrink-0 disabled:opacity-50"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={addSubjectRow}
                            disabled={subjectMutation.isPending}
                            className="w-full border border-dashed border-[#D0C4F0] rounded-xl py-2.5 text-sm font-semibold text-[#8070AA] hover:bg-[#F5F0FF] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <span className="text-base leading-none">+</span>
                            Add subject
                        </button>
                    </div>

                    <div className="h-px bg-[#F0EBF8] mb-3" />

                    <Button
                        onClick={handleAddSubjects}
                        disabled={subjectMutation.isPending}
                        className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold mb-3"
                        fullWidth
                    >
                        {subjectMutation.isPending ? "Saving…" : "Done →"}
                    </Button>

                    <Button
                        onClick={handleSkip}
                        disabled={subjectMutation.isPending}
                        className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                        fullWidth
                    >
                        Skip for now
                    </Button>
                </>
            )}
        </div>
    );
};

export default AddSemesterPage;