import Card from "../../components/subject/Card";
import moment from "moment";
import useTodaySubjects from "../../hooks/useTodaySubjects.js";
const HomePage = () => {
    const { today, todaySubjects, isLoading } = useTodaySubjects();

    if (isLoading) return <p>Loading...</p>;

    return (
        <>
            <div className="flex flex-1 justify-center pb-4">
                {moment(today).format("dddd, MMMM Do YYYY")}
            </div>
            <div className="flex flex-col gap-2">
                {todaySubjects.length === 0 ? (
                    <p>No classes today 🎉</p>
                ) : (
                    todaySubjects.map((subject) => (
                        <Card
                            key={subject.id}
                            subject={subject.name}
                            percentage={subject.percentage}
                            status={subject.status}
                        />
                    ))
                )}
            </div>
        </>
    );
};
export default HomePage;
