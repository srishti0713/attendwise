const SubjectLegend = ({
    subjects,
    activeDay,
    activeDayIds,
    colorMap,
    onAddSubject,
    // Optional label override for when no day is active.
    // TimetablePage passes "Subjects"; AddTimetablePage passes "Subjects — select a day first"
    idleLabel = "Subjects",
}) => (
    <div
        className={`bg-white border rounded-2xl p-4 sm:p-5 mb-3 transition-colors ${
            activeDay
                ? "border-[#9B72F5] ring-1 ring-[#9B72F5]"
                : "border-[#E2DBF0]"
        }`}
    >
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-3">
            {activeDay ? `Adding to ${activeDay} — pick a subject` : idleLabel}
        </p>

        {subjects.length === 0 ? (
            <p className="text-xs text-[#8070AA] font-medium">
                No subjects added yet.
            </p>
        ) : (
            <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => {
                    const isDisabled =
                        activeDay && activeDayIds.has(subject._id);
                    const isClickable = !!activeDay && !isDisabled;
                    return (
                        <span
                            key={subject._id}
                            onClick={() => isClickable && onAddSubject(subject)}
                            className={`text-[11px] font-semibold border rounded-2xl px-3 py-1.5 sm:px-6 sm:py-3 transition-opacity
                                ${colorMap.get(subject._id)}
                                ${isDisabled ? "opacity-30" : ""}
                                ${isClickable ? "cursor-pointer" : "cursor-default"}
                            `}
                        >
                            {subject.subjectName}
                        </span>
                    );
                })}
            </div>
        )}
    </div>
);

export default SubjectLegend;
