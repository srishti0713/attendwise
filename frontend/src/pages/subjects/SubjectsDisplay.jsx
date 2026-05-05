import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSubjects from "../../hooks/useSubjects";
import useAllSemesters from "../../hooks/useAllSemesters";
import useSemester from "../../hooks/useSemester";
import AttendanceCircle from "../../components/subject/AttendanceCircle";
import useCurrentSemester from "../../hooks/useCurrentSemester";

const CARD_STYLES = {
    safe: "bg-[#B8E8CC] border border-[#8FD4AA]",
    moderate: "bg-[#F5E6A3] border border-[#E8CC6A]",
    danger: "bg-[#F5B8C8] border border-[#E88FA8]",
};

const OverallCard = ({ subjects }) => {
    if (!subjects.length) return null;

    const { totalAttended, totalClasses, overallPercentage } = subjects[0];

    return (
        <div className="bg-[#D6CBFA] border border-[#6639ed] text-[#4A20C4] rounded-2xl p-4 w-full max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest mb-3">
                Overall Attendance
            </p>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold font-playfair">
                        {overallPercentage}%
                    </p>
                    <p className="text-sm font-medium mt-4">
                        {totalAttended} / {totalClasses} classes attended
                    </p>
                </div>
                <div className="text-5xl font-bold font-playfair opacity-10">
                    ∑
                </div>
            </div>
        </div>
    );
};

const SubjectRow = ({ subject }) => {
    const cardStyle = CARD_STYLES[subject.status] ?? CARD_STYLES.danger;

    return (
        <div className={`${cardStyle} rounded-2xl p-4 w-full max-w-2xl mx-auto`}>
            <div className="flex items-center gap-4">
                <AttendanceCircle
                    percentage={subject.attendancePercentage}
                    status={subject.status}
                />
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A2E]">
                        {subject.subjectName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {subject.classesToSafeZone > 0
                            ? `You need to attend ${subject.classesToSafeZone} classes`
                            : subject.classesToGoal > 0
                              ? `You need to attend ${subject.classesToGoal} classes`
                              : `You can miss ${subject.canMiss} ${subject.canMiss === 1 ? "class" : "classes"}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Pencil icon — kept as a named constant so it's easy to swap
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

const SubjectsDisplay = () => {
    const navigate = useNavigate();
    const { data: currentSemester } = useCurrentSemester();

    const [selectedSemester, setSelectedSemester] = useState(
        currentSemester?._id,
    );

    const { data: semesters = [] } = useAllSemesters();

    useEffect(() => {
        if (currentSemester?._id && !selectedSemester) {
            setSelectedSemester(currentSemester._id);
        }
    }, [currentSemester, selectedSemester]);

    const { data: subjects = [], isLoading } = useSubjects(selectedSemester);
    const { data: semester } = useSemester(selectedSemester);

    return (
        <div className="p-4 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                {/* Title + edit button grouped together */}
                <div className="flex items-center gap-2 min-w-0">
                    <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E] truncate">
                        Subjects{" "}
                        {semester?.semesterName ? (
                            <span className="font-sans text-lg font-semibold text-[#8070AA]">
                                — {semester.semesterName}
                            </span>
                        ) : (
                            ""
                        )}
                    </h1>

                    {/* Edit button — only shown when a semester is selected */}
                    {selectedSemester && (
                        <button
                            onClick={() =>
                                navigate(`/semesters/${selectedSemester}/edit`)
                            }
                            title="Edit semester"
                            className="w-5 h-5 shrink-0 flex items-center justify-center rounded-lg bg-[#E8E0F8] text-[#6B52B5] hover:bg-[#D6CBFA] hover:text-[#4A20C4] transition-colors"
                        >
                            <PencilIcon />
                        </button>
                    )}
                </div>

                {/* Semester dropdown */}
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-full px-4 py-2 text-sm font-semibold outline-none cursor-pointer shrink-0 ml-3"
                >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                        <option
                            key={sem._id}
                            value={sem._id}
                            className="text-black"
                        >
                            {sem.semesterName || "Semester"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading */}
            {isLoading && (
                <p className="text-center text-[#8070AA] font-medium mt-10">
                    Loading...
                </p>
            )}

            {/* Empty */}
            {!isLoading && subjects.length === 0 && (
                <p className="text-center text-[#8070AA] font-medium mt-10">
                    No subjects found
                </p>
            )}

            {/* Overall Card */}
            {!isLoading && subjects.length > 0 && (
                <div className="mb-4">
                    <OverallCard subjects={subjects} />
                </div>
            )}

            {/* Subject List */}
            <div className="flex flex-col gap-3">
                {subjects.map((sub) => (
                    <SubjectRow key={sub._id} subject={sub} />
                ))}
            </div>
        </div>
    );
};

export default SubjectsDisplay;