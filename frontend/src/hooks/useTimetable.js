import { useQuery } from "@tanstack/react-query";
import { getTimetable } from "../api/timetable.api.js";

const useTimetable = (semesterId) => {
    return useQuery({
        queryKey: ["timetable", semesterId],

        queryFn: async () => {
            try {
                const timetable = await getTimetable(semesterId);
                return timetable ?? null; 
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }
        },

        enabled: !!semesterId,

        retry: false,

        staleTime: 5 * 60 * 1000,
    });
};

export default useTimetable;
