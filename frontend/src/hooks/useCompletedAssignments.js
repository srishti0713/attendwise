import { useQuery } from "@tanstack/react-query";
import { getCompletedAssignments } from "../api/assignment.api";

const useCompletedAssignments = (subjectId) => {
    return useQuery({
        queryKey: ["assignments", "subject", subjectId, "completed"],
        queryFn: async () => {
            const res = await getCompletedAssignments(subjectId);
            return res;
        },
        enabled: !!subjectId,
        retry: false,
    });
};

export default useCompletedAssignments;
