import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCurrentSemester from "../../hooks/useCurrentSemester";
import useSubjects from "../../hooks/useSubjects";
import { getTimetable, editTimetable } from "../../api/timetable.api";
import ConfirmModal from "../../components/modal/ConfirmModal";
import Button from "../../components/buttons/Button";
import { DAYS, DAY_SHORT, SUBJECT_COLORS } from "../../lib/timetableConfig";
import SubjectCard from "../../components/timetable/SubjectCard.jsx";


const PencilIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11H1.5V8.5L9.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);


const buildColorMap = (subjects) => {
    const map = new Map();
    subjects.forEach((subject) => {
        if (!map.has(subject._id)) {
            map.set(
                subject._id,
                SUBJECT_COLORS[map.size % SUBJECT_COLORS.length]
            );
        }
    });
    return map;
};

const timetableToLocal = (timetable) => {
    const local = {};
    DAYS.forEach((day) => {
        local[day] = (timetable[day] || []).map((s) => ({
            _id: s._id,
            subjectName: s.subjectName,
        }));
    });
    return local;
};

const DraggableColumn = ({
    day,
    subjects,
    colorMap,
    isEditMode,
    activeDay,
    onSetActiveDay,
    onDelete,
    onDrop,
}) => {
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const draggingIndex = useRef(null);

    const handleDragStart = (e, index) => {
        draggingIndex.current = index;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${day}::${index}`);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverIndex(index);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData("text/plain");
        const [fromDay, fromIndexStr] = raw.split("::");
        if (fromDay !== day) {
            setDragOverIndex(null);
            return;
        }
        const fromIndex = parseInt(fromIndexStr, 10);
        if (fromIndex !== dropIndex) {
            onDrop(day, fromIndex, dropIndex);
        }
        setDragOverIndex(null);
        draggingIndex.current = null;
    };

    const handleDragEnd = () => {
        setDragOverIndex(null);
        draggingIndex.current = null;
    };

    const isActive = activeDay === day;

    return (
        <div className="flex flex-col gap-1 sm:gap-2">
            {subjects.map((subject, index) => (
                <div
                    key={subject._id + index}
                    draggable={isEditMode}
                    onDragStart={(e) => isEditMode && handleDragStart(e, index)}
                    onDragOver={(e) => isEditMode && handleDragOver(e, index)}
                    onDrop={(e) => isEditMode && handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-transform duration-100 ${
                        isEditMode && dragOverIndex === index
                            ? "translate-y-1"
                            : ""
                    }`}
                >
                    <SubjectCard
                        subject={subject}
                        colorClass={colorMap.get(subject._id) ?? SUBJECT_COLORS[0]}
                        isEditMode={isEditMode}
                        onDelete={onDelete}
                        isDragging={false}
                    />
                </div>
            ))}

            {isEditMode && (
                <button
                    onClick={() => onSetActiveDay(isActive ? null : day)}
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
};

const TimetablePage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: semester, isLoading: semesterLoading } = useCurrentSemester();
    const semesterId = semester?._id;

    const { data: subjects = [], isLoading: subjectsLoading } =
        useSubjects(semesterId);

    const {
        data: timetableData,
        isLoading: timetableLoading,
        isError: timetableError,
    } = useQuery({
        queryKey: ["timetable", semesterId],
        queryFn: async () => {
            try {
                return await getTimetable(semesterId);
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },
        enabled: !!semesterId,
        retry: false,
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [localTimetable, setLocalTimetable] = useState(null);
    const [activeDay, setActiveDay] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const original = timetableToLocal(timetableData.timetable);
            const promises = DAYS.map((day) => {
                const originalIds = original[day].map((s) => s._id);
                const localIds = localTimetable[day].map((s) => s._id);
                const changed =
                    JSON.stringify(originalIds) !== JSON.stringify(localIds);
                if (changed) {
                    return editTimetable(semesterId, day, localIds);
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["timetable", semesterId]);
            setIsEditMode(false);
            setActiveDay(null);
            setLocalTimetable(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ day, subjectId }) => {
            const current = localTimetable[day].map((s) => s._id);
            const updated = current.filter((id) => id !== subjectId);
            return editTimetable(semesterId, day, updated);
        },
        onSuccess: (_, { day, subjectId }) => {
            queryClient.invalidateQueries(["timetable", semesterId]);
            setLocalTimetable((prev) => ({
                ...prev,
                [day]: prev[day].filter((s) => s._id !== subjectId),
            }));
            setDeleteTarget(null);
        },
    });

    const handleEnterEdit = () => {
        if (!timetableData) return;
        setLocalTimetable(timetableToLocal(timetableData.timetable));
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setActiveDay(null);
        setLocalTimetable(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await saveMutation.mutateAsync().finally(() => setIsSaving(false));
    };

    const handleDrop = (day, fromIndex, toIndex) => {
        setLocalTimetable((prev) => {
            const updated = [...prev[day]];
            const [moved] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, moved);
            return { ...prev, [day]: updated };
        });
    };

    const handleAddSubject = (subject) => {
        if (!activeDay) return;
        const alreadyIn = localTimetable[activeDay].some(
            (s) => s._id === subject._id
        );
        if (alreadyIn) return;
        setLocalTimetable((prev) => ({
            ...prev,
            [activeDay]: [
                ...prev[activeDay],
                { _id: subject._id, subjectName: subject.subjectName },
            ],
        }));
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        deleteMutation.mutate({
            day: deleteTarget.day,
            subjectId: deleteTarget.subject._id,
        });
    };

    const colorMap = buildColorMap(subjects);
    const hasTimetable = !!timetableData && !timetableError;

    const displayTimetable = isEditMode
        ? localTimetable
        : hasTimetable
        ? timetableToLocal(timetableData.timetable)
        : null;

    const maxSlots = displayTimetable
        ? Math.max(...DAYS.map((d) => (displayTimetable[d] || []).length), 0)
        : 0;

    if (semesterLoading || subjectsLoading || timetableLoading)
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
        activeDay ? (localTimetable?.[activeDay] || []).map((s) => s._id) : []
    );

    return (
        <>
            {deleteTarget && (
                <ConfirmModal
                    variant="danger"
                    title="Remove subject?"
                    message={`Remove ${deleteTarget.subject.subjectName} from ${deleteTarget.day}? This cannot be undone.`}
                    confirmLabel="Remove"
                    confirmClass="bg-[#F5B8C8] text-[#7A1530]"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="w-full max-w-2xl mx-auto pb-24 px-3 sm:px-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        {/* Title + pencil inline */}
                        <div className="flex items-center gap-2">
                            <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                                Timetable
                            </h1>
                            {hasTimetable && !isEditMode && (
                                <button
                                    onClick={handleEnterEdit}
                                    className="w-6 h-6 shrink-0 flex items-center justify-center rounded-lg bg-[#E8E0F8] text-[#6B52B5]"
                                >
                                    <PencilIcon />
                                </button>
                            )}
                        </div>
                        <p className="font-sans text-sm sm:text-lg font-semibold text-[#8070AA]">
                            Your weekly subject schedule
                        </p>
                    </div>

                    {/* Save / Cancel — only in edit mode */}
                    {isEditMode && (
                        <div className="flex gap-2 mt-1">
                            <Button
                                onClick={handleCancelEdit}
                                className="text-[#4A20C4] bg-[#D6CBFA] border border-[#C4B0F7] rounded-xl px-4 py-2 text-xs font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-[#1A1A2E] text-white border-none rounded-xl px-4 py-2 text-xs font-bold"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Subject Legend */}
                <div
                    className={`bg-white border rounded-2xl p-4 sm:p-5 mb-3 transition-colors ${
                        isEditMode && activeDay
                            ? "border-[#9B72F5] ring-1 ring-[#9B72F5]"
                            : "border-[#E2DBF0]"
                    }`}
                >
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-3">
                        {isEditMode && activeDay
                            ? `Adding to ${activeDay} — pick a subject`
                            : "Subjects"}
                    </p>
                    {subjects.length === 0 ? (
                        <p className="text-xs text-[#8070AA] font-medium">
                            No subjects added yet.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject) => {
                                const isDisabled =
                                    isEditMode &&
                                    activeDay &&
                                    activeDayIds.has(subject._id);
                                const isClickable =
                                    isEditMode && activeDay && !isDisabled;
                                return (
                                    <span
                                        key={subject._id}
                                        onClick={() =>
                                            isClickable &&
                                            handleAddSubject(subject)
                                        }
                                        className={`text-[11px] font-semibold border rounded-2xl px-3 py-1.5 sm:px-6 sm:py-3 transition-opacity
                                            ${colorMap.get(subject._id)}
                                            ${isDisabled ? "opacity-30" : ""}
                                            ${isClickable ? "cursor-pointer" : ""}
                                        `}
                                    >
                                        {subject.subjectName}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Timetable Grid */}
                {!hasTimetable ? (
                    <button
                        onClick={() => navigate("/add-timetable")}
                        className="w-full bg-white border-2 border-dashed border-[#C4B0F7] rounded-2xl p-8 flex flex-col items-center gap-2 text-[#8070AA]"
                    >
                        <span className="text-xs font-bold">
                            Add your timetable
                        </span>
                        <span className="text-[11px] font-medium text-[#B0A0CC]">
                            Tap to get started
                        </span>
                    </button>
                ) : (
                    <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                            Weekly schedule
                        </p>
                        <div className="grid grid-cols-6 gap-1 sm:gap-2">
                            {DAYS.map((day) => (
                                <div
                                    key={day}
                                    className={`text-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase pb-2 border-b mb-1 transition-colors
                                        ${
                                            isEditMode && activeDay === day
                                                ? "text-[#9B72F5] border-[#9B72F5]"
                                                : "text-[#8070AA] border-[#F0EBF8]"
                                        }`}
                                >
                                    {DAY_SHORT[day]}
                                </div>
                            ))}

                            {DAYS.map((day) => (
                                <DraggableColumn
                                    key={day}
                                    day={day}
                                    subjects={displayTimetable[day] || []}
                                    colorMap={colorMap}
                                    isEditMode={isEditMode}
                                    activeDay={activeDay}
                                    onSetActiveDay={setActiveDay}
                                    onDelete={(subject) =>
                                        setDeleteTarget({ subject, day })
                                    }
                                    onDrop={handleDrop}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TimetablePage;