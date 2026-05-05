import { useMemo } from "react";
import useCurrentSemester from "./useCurrentSemester";
import useTimetable from "./useTimetable";

const useTodaySubjects = () => {
    // Get current semester
    const {
        data: semester,
        isLoading: semesterLoading,
        error: semesterError,
    } = useCurrentSemester();

    // Get timetable using semesterId
    const {
        data: timetable,
        isLoading: timetableLoading,
        error: timetableError,
    } = useTimetable(semester?._id);

    // Get today's date
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    

    // Extract today's subjects
    const todaySubjects = useMemo(() => {
        if (!timetable?.timetable) return [];

        return timetable.timetable[today] || [];
    }, [timetable, today]);

   

    return {
        semester,
        today,
        todaySubjects,

        isLoading: semesterLoading || timetableLoading,
        error: semesterError || timetableError,
    };
};

export default useTodaySubjects;
