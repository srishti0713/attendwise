import Card from "../../components/subject/Card";
import moment from "moment";
import useTodaySubjects from "../../hooks/useTodaySubjects.js";
import { useSearchParams } from "react-router-dom";

const HomePage = () => {
    const { todaySubjects, isLoading } = useTodaySubjects();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "attendance";

    if (isLoading) return <p>Loading...</p>;

    return (
        <>
            {/* Date */}
            <div className="flex flex-1 justify-center text-gray-500 font-semibold pb-4 text-sm tracking-wide">
                {moment().format("dddd, MMMM Do YYYY")}
            </div>

            {/* Tab Switcher */}
            <div className="flex mx-auto w-full max-w-sm mb-5 bg-[#E2DBF0] rounded-full p-1">
                <button
                    onClick={() => setSearchParams({ tab: "attendance" })}
                    className={`flex-1 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
                        activeTab === "attendance"
                            ? "bg-[#1A1A2E] text-white"
                            : "text-[#8070AA]"
                    }`}
                >
                    ATTENDANCE
                </button>
                <button
                    onClick={() => setSearchParams({ tab: "assignments" })}
                    className={`flex-1 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
                        activeTab === "assignments"
                            ? "bg-[#1A1A2E] text-white"
                            : "text-[#8070AA]"
                    }`}
                >
                    ASSIGNMENTS
                </button>
            </div>

            {/* Content */}
            {activeTab === "attendance" && (
                <div className="flex flex-col gap-5 sm:gap-3 md:gap-3 items-center">
                    {todaySubjects.length === 0 ? (
                        <p>No classes today 🎉</p>
                    ) : (
                        todaySubjects.map((subject) => (
                            <Card
                                key={subject._id}
                                subject={subject.subjectName}
                                percentage={subject.attendancePercentage}
                                status={subject.status}
                                classesToSafe={subject.classesToSafeZone}
                                classesToGoal={subject.classesToGoal}
                            />
                        ))
                    )}
                </div>
            )}

            {activeTab === "assignments" && (
                <div className="flex flex-col gap-3 w-full">
                    <p className="text-sm text-[#8070AA] font-semibold text-center">
                        Assignments coming soon
                    </p>
                </div>
            )}
        </>
    );
};

export default HomePage;
