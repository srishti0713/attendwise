import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/home");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div
            className="relative min-h-screen flex items-start justify-center pt-16 overflow-x-hidden font-[Outfit] 
      bg-[radial-gradient(ellipse_at_50%_10%,#1c3d7a_0%,#0e2050_30%,#06112b_65%,#020810_100%)]"
        >
            {/* Background stars */}
            <div
                className="pointer-events-none fixed inset-0 
        bg-[radial-gradient(1px_1px_at_15%_25%,rgba(255,255,255,0.35)_0%,transparent_100%),
             radial-gradient(1px_1px_at_75%_15%,rgba(255,255,255,0.25)_0%,transparent_100%),
             radial-gradient(1px_1px_at_40%_60%,rgba(255,255,255,0.2)_0%,transparent_100%),
             radial-gradient(1px_1px_at_85%_75%,rgba(255,255,255,0.3)_0%,transparent_100%)]"
            ></div>

            <div className="relative z-10 w-full max-w-sm px-6 pb-10 text-center">
                <h2 className="text-white text-2xl font-extrabold mb-5">
                    {" "}
                    Login to {import.meta.env.VITE_APP_NAME}
                </h2>

                <div className="w-full h-px bg-white/10 mb-5"></div>

                <p className="text-[#b0bfd8] text-sm mb-6">
                    New user?{" "}
                    <Link to="/register" className="text-[#4d8eff]">
                        Create account →
                    </Link>
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-4 mb-3 rounded-lg border border-[rgba(100,140,220,0.25)]
          bg-[rgba(10,30,80,0.5)] text-[#c8d8f0] text-sm outline-none
          placeholder:text-[#5a7aaa] focus:border-[#4d8eff]"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full p-4 mb-3 rounded-lg border border-[rgba(100,140,220,0.25)]
          bg-[rgba(10,30,80,0.5)] text-[#c8d8f0] text-sm outline-none
          placeholder:text-[#5a7aaa] focus:border-[#4d8eff]"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="text-right mb-4">
                        <Link
                            to="#"
                            className="text-[#4d8eff] text-xs no-underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        className="w-full p-4 mt-1 rounded-xl text-white text-base font-bold cursor-pointer
          bg-[linear-gradient(180deg,#4a7de8_0%,#2a5fd6_100%)]
          shadow-[0_6px_24px_rgba(42,95,214,0.55)]
          hover:bg-[linear-gradient(180deg,#5a8df0_0%,#3a6fe0_100%)]"
                    >
                        Login
                    </button>
                </form>
                {/* Error */}
                {mutation.isError && (
                    <p className="text-error text-sm">
                        {mutation.error?.response?.data?.message ||
                            mutation.error?.message ||
                            "An error occurred"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
