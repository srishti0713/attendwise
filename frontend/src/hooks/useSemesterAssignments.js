import { useQuery } from "@tanstack/react-query";
import { getSemesterAssignments } from "../api/assignment.api";

const useSemesterAssignments = (semesterId) => {
    return useQuery({
        queryKey: ["assignments", "semester", semesterId],
        queryFn: async () => {
            const res = await getSemesterAssignments(semesterId);
            return res;
        },
        enabled: !!semesterId,
        retry: false,
    });
};

export default useSemesterAssignments;
