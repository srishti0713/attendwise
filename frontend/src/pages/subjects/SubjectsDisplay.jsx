import { useState, useEffect } from "react";
import useSubjects from "../../hooks/useSubjects";
import useAllSemesters from "../../hooks/useAllSemesters";
import useSemester from "../../hooks/useSemester";
import AttendanceCircle from "../../components/subjects/AttendanceCircle";

//  Subject Row (Divider Layout)
const SubjectRow = ({ subject }) => {
    return (
        <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-4">
                <AttendanceCircle
                    percentage={subject.attendancePercentage}
                    status={subject.status}
                />

                <div>
                    <h2 className="text-lg font-medium">
                        {subject.subjectName}
                    </h2>
                    <p className="text-sm text-gray-500">
                        ({subject.attendancePercentage}% / 100)
                    </p>
                </div>
            </div>
        </div>
    );
};

//  Main Page
const SubjectsDisplay = () => {

    const [selectedSemester, setSelectedSemester] = useState("");

    const { data: semesters = [], status } = useAllSemesters();

    console.log("SEMESTERS:", semesters);
    console.log("STATUS:", status);

   
    const { data: subjects = [], isLoading } = useSubjects(selectedSemester);

    
    const { data: semester } = useSemester(selectedSemester);

    useEffect(() => {
        if (semesters.length > 0 && !selectedSemester) {
            setSelectedSemester(semesters[0]._id);
        }
    }, [semesters]);

    return (
        <div className="min-h-screen  p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-black text-2xl font-bold">
                    Subjects {semester?.semesterName ? `- ${semester.semesterName}` : ""}
                </h1>

                {/* Dropdown */}
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="p-2 rounded border"
                >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                        <option key={sem._id} value={sem._id} className = "text-black">
                            {sem.semesterName || "Semester"}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading */}
            {isLoading && <p>Loading...</p>}

            {/* Empty */}
            {!isLoading && subjects.length === 0 && (
                <p className="text-gray-600">No subjects found</p>
            )}

            {/* Divider List */}
            <div className="bg-white rounded-xl shadow-sm px-4 text-black">
                {subjects.map((sub) => (
                    <SubjectRow key={sub._id} subject={sub} />
                ))}
            </div>
        </div>
    );
};

export default SubjectsDisplay;
