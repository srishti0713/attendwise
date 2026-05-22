import { useQuery } from "@tanstack/react-query";
import { getAssignment } from "../api/assignment.api";

const useAssignment = (assignmentId) => {
    return useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: async () => {
            const res = await getAssignment(assignmentId);
            return res;
        },
        enabled: !!assignmentId,
        retry: false,
    });
};

export default useAssignment;
