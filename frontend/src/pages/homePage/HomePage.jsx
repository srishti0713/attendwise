import Card from "../../components/subject/Card";
import moment from "moment";
import AttendanceCircle from "../../components/subjects/AttendanceCircle";

const HomePage = () => {
    return (
        <>
            <div className="flex flex-1 justify-center pb-4">
                {moment().format("dddd, MMMM Do YYYY")}
            </div>
            <div className="flex flex-col gap-2">
                <Card subject="IWT" percentage="100" status="safe"/>
                <Card subject="FDA" percentage="66.7" status="moderate"/>
                <Card subject="AI" percentage="0" status="danger"/>
            </div>
        </>
    );
};
export default HomePage;
