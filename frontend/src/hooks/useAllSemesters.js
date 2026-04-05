import { useQuery } from "@tanstack/react-query";
import { getSemesters } from "../api/semester.api";

const useAllSemesters = () => {
    return useQuery({
        queryKey: ["semesters"],
        queryFn: async () => {
            try {
                const semesters = await getSemesters();
                return semesters;
            } catch (error) {
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export default useAllSemesters;
