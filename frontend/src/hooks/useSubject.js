import { useQuery } from "@tanstack/react-query";
import { getSubject } from "../api/subject.api";

const useSubject = (subjectId) =>{
    return useQuery({
        queryKey: ["subject", subjectId],
        queryFn: async () => {
            try {
                const subject = await getSubject(subjectId);
                return subject;
            } catch (error) {
                throw new Error("Failed to fetch subject");
            }
        },
        enabled: !!subjectId,
        staleTime: 5 * 60 * 1000,
    });
};

export default useSubject;