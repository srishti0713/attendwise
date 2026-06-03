import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../api/auth.api";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["user"] });
            navigate("/home");
        },
    });

    const handleSubmit = () => {
        const formData = new FormData();
        const { name, email, password } = form;
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        mutation.mutate(formData);
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
                        Create your free account
                    </p>
                </div>

                {/* Inputs */}
                <input
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/40 font-medium"
                    style={{
                        background: "rgba(255,255,255,0.35)",
                        border: "1px solid rgba(255,255,255,0.5)",
                    }}
                />

                <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/40 font-medium"
                    style={{
                        background: "rgba(255,255,255,0.35)",
                        border: "1px solid rgba(255,255,255,0.5)",
                    }}
                />

                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] outline-none placeholder:text-[#1A1A2E]/40 font-medium pr-11"
                        style={{
                            background: "rgba(255,255,255,0.35)",
                            border: "1px solid rgba(255,255,255,0.5)",
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A2E]/50 hover:text-[#1A1A2E]/80"
                    >
                        {showPassword ? (
                            <EyeOff size={16} />
                        ) : (
                            <Eye size={16} />
                        )}
                    </button>
                </div>

                {/* Error */}
                {mutation.isError && (
                    <p className="text-red-700 text-sm text-center font-medium">
                        {mutation.error?.response?.data?.message ||
                            mutation.error?.message ||
                            "Something went wrong"}
                    </p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="w-full py-3 rounded-xl text-white text-sm font-bold cursor-pointer border-none"
                    style={{ background: "#1A1A2E" }}
                >
                    {mutation.isPending
                        ? "Creating account..."
                        : "Create Account"}
                </button>

                {/* Divider */}
                <div
                    className="h-px w-2/3 mx-auto"
                    style={{
                        background:
                            "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)",
                    }}
                />

                {/* Sign in link */}
                <p className="text-center text-sm text-[#2D2D4A] opacity-75">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#1A1A2E] opacity-100 underline underline-offset-2"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
