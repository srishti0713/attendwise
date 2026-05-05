import { useQuery } from "@tanstack/react-query";
import useCurrentSemester from "../../hooks/useCurrentSemester";
import { getTimetable } from "../../api/timetable.api";
import useSubjects from "../../hooks/useSubjects";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const DAY_SHORT = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
};

const SUBJECT_COLORS = [
    "bg-[#D6CBFA] border-[#C4B0F7] text-[#3C2A8A]",
    "bg-[#B8E8CC] border-[#8FD4AA] text-[#2E8B57]",
    "bg-[#F5E6A3] border-[#E8CC6A] text-[#7A4A00]",
    "bg-[#F5B8C8] border-[#E88FA8] text-[#7A1530]",
    "bg-[#B8D8F5] border-[#8FBDE8] text-[#1A3A6B]",
    "bg-[#F5D6B8] border-[#E8B88F] text-[#7A3A00]",
];

// Builds a stable subjectId → color class map across the whole timetable.
// Uses % so subjects beyond 6 cycle back through the palette.
const buildColorMap = (timetable) => {
    const map = new Map();
    DAYS.forEach((day) => {
        (timetable[day] || []).forEach((subject) => {
            if (!map.has(subject._id)) {
                map.set(
                    subject._id,
                    SUBJECT_COLORS[map.size % SUBJECT_COLORS.length],
                );
            }
        });
    });
    return map;
};


// Cards use minimal padding on mobile, slightly more on sm+
const SubjectCard = ({ subjectName, colorClass }) => (
    <div
        className={`border rounded-2xl p-1 sm:px-8 sm:py-4 text-center text-[9px] sm:text-[11px] font-semibold leading-tight wrap-break-word ${colorClass}`}
    >
        {subjectName}
    </div>
);

const TimetablePage = () => {
    const { data: semester, isLoading: semesterLoading } = useCurrentSemester();
    const semesterId = semester?._id;

    const { data: subjects = [], isLoading: subjectsLoading } =
        useSubjects(semesterId);

    const {
        data: timetableData,
        isLoading: timetableLoading,
        isError : timetableError,
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

    // Build color map from subjects list directly (independent of timetable)
    const subjectColorMap = new Map();
    subjects.forEach((subject) => {
        if (!subjectColorMap.has(subject._id)) {
            subjectColorMap.set(
                subject._id,
                SUBJECT_COLORS[subjectColorMap.size % SUBJECT_COLORS.length],
            );
        }
    });

    // if (isError || !timetableData)
    //     return (
    //         <p className="text-center text-[#8070AA] font-medium mt-10">
    //             Could not load timetable.
    //         </p>
    //     );

    const hasTimetable = timetableData && !timetableError;
    const timetable = hasTimetable ? timetableData.timetable : null;

    // If timetable exists, build its color map using the same palette order as subjects
    const timetableColorMap = timetable ? buildColorMap(timetable) : new Map();

    // For timetable cards, prefer the subjectColorMap so colors stay consistent
    // with the legend. Fall back to timetableColorMap for subjects only in timetable.
    const getCardColor = (subjectId) =>
        subjectColorMap.get(subjectId) ?? timetableColorMap.get(subjectId);

    const maxSlots = timetable
        ? Math.max(...DAYS.map((d) => (timetable[d] || []).length))
        : 0;

    return (
        <div className="w-full max-w-2xl mx-auto pb-24 px-3 sm:px-0">
            {/* Header */}
            <div className="mb-5">
                <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    Timetable
                </h1>
                <p className="font-sans text-sm sm:text-lg font-semibold text-[#8070AA]">
                    Your weekly subject schedule
                </p>
            </div>

            {/* Subject Legend */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-3">
                    Subjects
                </p>
                {subjects.length === 0 ? (
                    <p className="text-xs text-[#8070AA] font-medium">
                        No subjects added yet.
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                            <span
                                key={subject._id}
                                className={`text-[11px] font-semibold border rounded-2xl px-3 py-1.5 sm:px-6 sm:py-3 ${subjectColorMap.get(subject._id)}`}
                            >
                                {subject.subjectName}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Timetable Grid */}
            {!hasTimetable ? (
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5">
                    <p className="text-xs text-[#8070AA] font-medium text-center py-6">
                        You have not added a timetable yet.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-4 sm:p-5">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                        Weekly schedule
                    </p>
                    <div className="grid grid-cols-6 gap-1 sm:gap-2">
                        {/* Day Headers */}
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className="text-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#8070AA] pb-2 border-b border-[#F0EBF8]"
                            >
                                {DAY_SHORT[day]}
                            </div>
                        ))}

                        {/* Subject Cards — row by row */}
                        {Array.from({ length: maxSlots }).flatMap((_, i) =>
                            DAYS.map((day) => {
                                const subject = (timetable[day] || [])[i];
                                return subject ? (
                                    <SubjectCard
                                        key={`${day}-${i}`}
                                        subjectName={subject.subjectName}
                                        colorClass={getCardColor(subject._id)}
                                    />
                                ) : (
                                    <div key={`${day}-${i}-empty`} />
                                );
                            }),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetablePage;
