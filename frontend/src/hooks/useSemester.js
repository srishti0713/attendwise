import { useQuery } from "@tanstack/react-query";
import { getSemester } from "../api/semester.api";

const useSemester = (semesterId) => {
    return useQuery({
        queryKey: ["semester", semesterId],
        queryFn: async () => {
            try {
                const semester = await getSemester(semesterId);
                return semester;
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

export default useSemester;
