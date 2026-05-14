const SubjectCard = ({
    subject,
    colorClass,
    isEditMode,
    onDelete,
    dragHandleProps,
    isDragging,
}) => (
    <div
        className={`relative border rounded-2xl p-1 sm:px-8 sm:py-4 text-center text-[9px] sm:text-[11px] font-semibold leading-tight wrap-break-word select-none
            ${colorClass}
            ${isDragging ? "opacity-50 scale-95" : ""}
            ${isEditMode ? "cursor-grab active:cursor-grabbing" : ""}
        `}
        {...dragHandleProps}
    >
        {subject.subjectName}
        {isEditMode && (
            <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(subject);
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1A1A2E] text-white text-[9px] flex items-center justify-center leading-none z-10"
            >
                ✕
            </button>
        )}
    </div>
);

export default SubjectCard;
