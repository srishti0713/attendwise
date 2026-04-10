import { useQuery } from "@tanstack/react-query";
import { getCurrentSemester } from "../api/semester.api";

const useCurrentSemester = () => {
    return useQuery({
        queryKey: ["currentSemester"],
        queryFn: async () => {
            const res = await getCurrentSemester();
            return res;
        },
        retry: false,
    });
};

export default useCurrentSemester;