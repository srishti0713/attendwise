import { useQuery } from "@tanstack/react-query";
import { getSubjectAssignments } from "../api/assignment.api";

const useSubjectAssignments = (subjectId) => {
    return useQuery({
        queryKey: ["assignments", "subject", subjectId],
        queryFn: async () => {
            const res = await getSubjectAssignments(subjectId);
            return res;
        },
        enabled: !!subjectId,
        retry: false,
    });
};

export default useSubjectAssignments;
