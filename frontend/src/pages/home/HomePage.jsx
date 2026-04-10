import Card from "../../components/subject/Card";
import moment from "moment";
import useTodaySubjects from "../../hooks/useTodaySubjects.js";

const HomePage = () => {
    const { todaySubjects, isLoading } = useTodaySubjects();

    if (isLoading) return <p>Loading...</p>;

    return (
        <>
            <div className="flex flex-1 justify-center text-black pb-4">
                {moment().format("dddd, MMMM Do YYYY")}
            </div>
            <div className="flex flex-col gap-5 sm:gap-3 md:gap-3">
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
        </>
    );
};
export default HomePage;
