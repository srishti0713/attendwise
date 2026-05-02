import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";

const useAuth = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const user = await getCurrentUser();
                return user;
            } catch (error) {
                console.log("getCurrentUser error:", error.response?.status); 
                if (error.response?.status === 401) return null;
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
    });
};

export default useAuth;
