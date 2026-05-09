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
            className="min-h-screen flex items-center justify-center px-6"
            style={{
                background:
                    "linear-gradient(135deg, #C9A96E 0%, #B8A9C9 40%, #9B9EC8 70%, #8B9DC8 100%)",
            }}
        >
            <div
                className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-5"
                style={{
                    background: "rgba(255,255,255,0.25)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                }}
            >
                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-1">
                        AttendWise
                    </h1>
                    <p className="text-sm text-[#2D2D4A] opacity-60 font-medium">
                        Welcome back!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/40 font-medium"
                        style={{
                            background: "rgba(255,255,255,0.35)",
                            border: "1px solid rgba(255,255,255,0.5)",
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/40 font-medium"
                        style={{
                            background: "rgba(255,255,255,0.35)",
                            border: "1px solid rgba(255,255,255,0.5)",
                        }}
                    />

                    <div className="text-right -mt-1">
                        <Link
                            to="#"
                            className="text-xs font-semibold text-[#1A1A2E] opacity-60"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Error */}
                    {mutation.isError && (
                        <p className="text-red-700 text-sm text-center font-medium">
                            {mutation.error?.response?.data?.message ||
                                mutation.error?.message ||
                                "An error occurred"}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
                        style={{ background: "#1A1A2E" }}
                    >
                        {mutation.isPending ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* Divider */}
                <div
                    className="h-px w-2/3 mx-auto"
                    style={{
                        background:
                            "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
                    }}
                />

                {/* Register link */}
                <p className="text-center text-sm text-[#2D2D4A] opacity-75">
                    New here?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-[#1A1A2E] opacity-100 underline underline-offset-2"
                    >
                        Create account →
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;