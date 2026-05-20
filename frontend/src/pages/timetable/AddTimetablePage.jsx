import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentSemester from "../../hooks/useCurrentSemester";
import useSubjects from "../../hooks/useSubjects";
import { postTimetable, extractTimetable } from "../../api/timetable.api";
import { addSubject } from "../../api/subject.api.js";
import Button from "../../components/buttons/Button";
import {
    DAYS,
    DAY_SHORT,
    SUBJECT_COLORS,
    buildColorMap,
} from "../../lib/timetableConfig.js";
import SubjectCard from "../../components/timetable/SubjectCard";
import SubjectLegend from "../../components/timetable/SubjectLegend";

const buildEmptyTimetable = () => {
    const tt = {};
    DAYS.forEach((day) => (tt[day] = []));
    return tt;
};

const AddTimetablePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const { data: semester, isLoading: semesterLoading } = useCurrentSemester();
    const semesterId = semester?._id;

    const { data: subjects = [], isLoading: subjectsLoading } =
        useSubjects(semesterId);

    // "manual" | "ai"
    const [mode, setMode] = useState("manual");

    const [timetable, setTimetable] = useState(buildEmptyTimetable);
    const [activeDay, setActiveDay] = useState(null);

    // AI state
    const [selectedFile, setSelectedFile] = useState(null);
    const [unmatchedSubjects, setUnmatchedSubjects] = useState([]);

    const colorMap = buildColorMap(subjects);

    // ── Save mutation ────────────────────────────────────────────────────────
    const saveMutation = useMutation({
        mutationFn: () => {
            const payload = {};
            DAYS.forEach((day) => {
                payload[day] = timetable[day].map((s) => s._id);
            });
            return postTimetable(semesterId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["timetable", semesterId]);
            navigate("/timetable");
        },
    });

    // ── AI extract mutation ──────────────────────────────────────────────────
    const extractMutation = useMutation({
        mutationFn: () => {
            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("semesterId", semesterId);
            return extractTimetable(formData);
        },
        onSuccess: ({ aiRaw }) => {
            const subjectNameMap = new Map();
            subjects.forEach((s) => {
                subjectNameMap.set(s.subjectName.trim().toLowerCase(), s);
            });

            const newTimetable = buildEmptyTimetable();
            const unmatched = new Set();

            DAYS.forEach((day) => {
                const names = aiRaw?.days?.[day] || [];
                names.forEach((name) => {
                    const match = subjectNameMap.get(name.trim().toLowerCase());
                    if (match) {
                        const alreadyIn = newTimetable[day].some(
                            (s) => s._id === match._id,
                        );
                        if (!alreadyIn) {
                            newTimetable[day].push({
                                _id: match._id,
                                subjectName: match.subjectName,
                            });
                        }
                    } else {
                        unmatched.add(name);
                    }
                });
            });

            setTimetable(newTimetable);
            setUnmatchedSubjects([...unmatched]);
        },
    });

    // Track per-subject add state: "idle" | "loading" | "added" | "error"
    const [unmatchedState, setUnmatchedState] = useState({});

    const addSubjectMutation = useMutation({
        mutationFn: (subjectName) => addSubject({ subjectName }, semesterId),

        onMutate: (subjectName) => {
            setUnmatchedState((prev) => ({
                ...prev,
                [subjectName]: "loading",
            }));
        },
        onSuccess: (newSubject, subjectName) => {
            setUnmatchedState((prev) => ({ ...prev, [subjectName]: "added" }));
            // Refresh subjects list so the new subject appears in the legend + colorMap
            queryClient.invalidateQueries(["subjects", semesterId]);
        },
        onError: (_, subjectName) => {
            setUnmatchedState((prev) => ({ ...prev, [subjectName]: "error" }));
        },
    });

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleModeSwitch = (newMode) => {
        setMode(newMode);
        setTimetable(buildEmptyTimetable());
        setActiveDay(null);
        setSelectedFile(null);
        setUnmatchedSubjects([]);
        extractMutation.reset();
        saveMutation.reset();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setUnmatchedSubjects([]);
            extractMutation.reset();
        }
    };

    const handleExtract = () => {
        if (!selectedFile) return;
        setTimetable(buildEmptyTimetable());
        setUnmatchedSubjects([]);
        extractMutation.mutate();
    };

    const handleAddSubject = (subject) => {
        if (!activeDay) return;
        const alreadyIn = timetable[activeDay].some(
            (s) => s._id === subject._id,
        );
        if (alreadyIn) return;
        setTimetable((prev) => ({
            ...prev,
            [activeDay]: [
                ...prev[activeDay],
                { _id: subject._id, subjectName: subject.subjectName },
            ],
        }));
    };

    const handleRemoveSubject = (day, subject) => {
        setTimetable((prev) => ({
            ...prev,
            [day]: prev[day].filter((s) => s._id !== subject._id),
        }));
    };

    const handleCancel = () => navigate("/timetable");
    const handleSave = () => saveMutation.mutate();

    // ── Loading / empty states ───────────────────────────────────────────────
    if (semesterLoading || subjectsLoading)
        return (
            <p className="text-center text-[#8070AA] font-medium mt-10">
                Loading...
            </p>
        );

    if (!semester)
        return (
            <p className="text-center text-[#8070AA] font-medium mt-10">
                You have not added a semester yet.
            </p>
        );

    const activeDayIds = new Set(
        activeDay ? (timetable[activeDay] || []).map((s) => s._id) : [],
    );

    const extractedSuccessfully = extractMutation.isSuccess;

    return (
        <div className="w-full max-w-2xl mx-auto pb-24 px-3 sm:px-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                        Add Timetable
                    </h1>
                    <p className="font-sans text-sm sm:text-lg font-semibold text-[#8070AA]">
                        Build your weekly subject schedule
                    </p>
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-2 mt-1">
                    <Button
                        onClick={handleCancel}
                        className="text-[#4A20C4] bg-[#D6CBFA] border border-[#C4B0F7] rounded-xl px-4 py-2 text-xs font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="bg-[#1A1A2E] text-white border-none rounded-xl px-4 py-2 text-xs font-bold disabled:opacity-60"
                    >
                        {saveMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* Mode toggle */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-1.5 flex gap-1.5 mb-3">
                <button
                    onClick={() => handleModeSwitch("manual")}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors
                        ${
                            mode === "manual"
                                ? "bg-[#1A1A2E] text-white"
                                : "text-[#8070AA]"
                        }`}
                >
                    Manual
                </button>
                <button
                    onClick={() => handleModeSwitch("ai")}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors
                        ${
                            mode === "ai"
                                ? "bg-[#1A1A2E] text-white"
                                : "text-[#8070AA]"
                        }`}
                >
                    AI Extract
                </button>
            </div>

            {/* AI upload section */}
            {mode === "ai" && (
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5 mb-3">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-3">
                        Upload timetable image
                    </p>

                    {/* Drop zone */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-[#C4B0F7] rounded-2xl py-8 flex flex-col items-center gap-2 text-[#8070AA] mb-3"
                    >
                        <span className="text-2xl">🖼</span>
                        <span className="text-xs font-semibold">
                            {selectedFile
                                ? selectedFile.name
                                : "Tap to choose an image"}
                        </span>
                        {selectedFile && (
                            <span className="text-[10px] text-[#B0A0CC]">
                                Tap to change
                            </span>
                        )}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <Button
                        onClick={handleExtract}
                        disabled={!selectedFile || extractMutation.isPending}
                        className="w-full bg-[#9B72F5] text-white border-none rounded-xl py-2.5 text-xs font-bold disabled:opacity-50"
                    >
                        {extractMutation.isPending
                            ? "Extracting..."
                            : "Extract Timetable"}
                    </Button>

                    {extractMutation.isError && (
                        <p className="text-xs text-[#7A1530] font-medium mt-3 text-center">
                            Extraction failed. Please try again.
                        </p>
                    )}

                    {/* Unmatched subjects warning */}
                    {extractedSuccessfully && unmatchedSubjects.length > 0 && (
                        <div className="mt-3 bg-[#FFF0F3] border border-[#E88FA8] rounded-2xl p-4">
                            <p className="text-xs font-bold text-[#7A1530] mb-1">
                                Some subjects weren't matched
                            </p>
                            <p className="text-[11px] text-[#7A1530] mb-2">
                                These subjects were found in your image but
                                aren't in your semester yet. Tap{" "}
                                <strong>+ Add</strong> to include them.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {unmatchedSubjects.map((name) => {
                                    const state =
                                        unmatchedState[name] ?? "idle";
                                    return (
                                        <button
                                            key={name}
                                            disabled={
                                                state === "loading" ||
                                                state === "added"
                                            }
                                            onClick={() =>
                                                addSubjectMutation.mutate(name)
                                            }
                                            className={`flex items-center gap-1.5 text-[11px] font-semibold rounded-xl px-3 py-1 border transition-colors
                            ${
                                state === "added"
                                    ? "bg-[#D1FAE5] border-[#6EE7B7] text-[#065F46]"
                                    : state === "error"
                                      ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#7F1D1D]"
                                      : state === "loading"
                                        ? "bg-[#F5B8C8] border-[#E88FA8] text-[#7A1530] opacity-60"
                                        : "bg-[#F5B8C8] border-[#E88FA8] text-[#7A1530] hover:bg-[#9B72F5] hover:border-[#9B72F5] hover:text-white"
                            }`}
                                        >
                                            {state === "added"
                                                ? "✓"
                                                : state === "loading"
                                                  ? "…"
                                                  : state === "error"
                                                    ? "✕ Retry"
                                                    : `+ ${name}`}
                                        </button>
                                    );
                                })}
                            </div>
                            {Object.values(unmatchedState).some(
                                (s) => s === "added",
                            ) && (
                                <p className="text-[11px] text-[#065F46] font-semibold mt-2">
                                    Added subjects will appear in the legend.
                                    You can now assign them to days.
                                </p>
                            )}
                        </div>
                    )}

                    {extractedSuccessfully &&
                        unmatchedSubjects.length === 0 && (
                            <p className="text-xs text-[#2E8B57] font-semibold mt-3 text-center">
                                All subjects matched — review and save below.
                            </p>
                        )}
                </div>
            )}

            {/* Subject Legend — always shown */}
            <SubjectLegend
                subjects={subjects}
                activeDay={activeDay}
                activeDayIds={activeDayIds}
                colorMap={colorMap}
                onAddSubject={handleAddSubject}
                idleLabel={
                    mode === "ai" && !extractedSuccessfully
                        ? "Subjects"
                        : "Subjects — select a day first"
                }
            />

            {/* Timetable Grid — in AI mode only show after extraction */}
            {(mode === "manual" || extractedSuccessfully) && (
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                        Weekly schedule
                    </p>

                    <div className="grid grid-cols-6 gap-1 sm:gap-2">
                        {/* Day Headers */}
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className={`text-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase pb-2 border-b mb-1 transition-colors
                                    ${
                                        activeDay === day
                                            ? "text-[#9B72F5] border-[#9B72F5]"
                                            : "text-[#8070AA] border-[#F0EBF8]"
                                    }`}
                            >
                                {DAY_SHORT[day]}
                            </div>
                        ))}

                        {/* Day Columns */}
                        {DAYS.map((day) => {
                            const isActive = activeDay === day;
                            return (
                                <div
                                    key={day}
                                    className="flex flex-col gap-1 sm:gap-2"
                                >
                                    {timetable[day].map((subject, index) => (
                                        <SubjectCard
                                            key={subject._id + index}
                                            subject={subject}
                                            colorClass={
                                                colorMap.get(subject._id) ??
                                                SUBJECT_COLORS[0]
                                            }
                                            isEditMode={true}
                                            onDelete={(s) =>
                                                handleRemoveSubject(day, s)
                                            }
                                            isDragging={false}
                                        />
                                    ))}

                                    {/* Add slot */}
                                    {timetable[day].length <
                                        subjects.length && (
                                        <button
                                            onClick={() =>
                                                setActiveDay(
                                                    isActive ? null : day,
                                                )
                                            }
                                            className={`border rounded-xl text-[10px] sm:text-[11px] font-semibold py-1.5 sm:py-2 w-full transition-colors
                                                ${
                                                    isActive
                                                        ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                                                        : "border-dashed border-[#C4B0F7] text-[#8070AA] bg-transparent"
                                                }`}
                                        >
                                            {isActive ? "↑ Close" : "+ Add"}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Save error */}
            {saveMutation.isError && (
                <p className="text-xs text-[#7A1530] font-medium mt-3 text-center">
                    Something went wrong. Please try again.
                </p>
            )}
        </div>
    );
};

export default AddTimetablePage;
