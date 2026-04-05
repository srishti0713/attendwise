import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../api/subject.api";

const useSubjects = (semesterId) => {
    return useQuery({
        queryKey: ["subjects", semesterId],
        queryFn: async () => {
            try {
                const subjects = await getSubjects(semesterId);
                return subjects;
            } catch (error) {
                if (error.response?.status === 404) return [];
                throw error;
            }
        },
        enabled: !!semesterId,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
};

export default useSubjects;
