import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../../api/auth.api";

const Register = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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
        const {
            name,
            email,

            password,
        } = form;

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        mutation.mutate(formData);
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
                {/* Logo */}
                <div className="flex justify-center gap-2 mb-2">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white
            bg-[linear-gradient(135deg,#3b6fd4,#2252b8)]"
                    >
                        ✔
                    </div>
                    <div className="text-2xl font-extrabold text-white">
                        Attend<span className="text-[#4d8eff]">Wise</span>
                    </div>
                </div>

                <p className="text-[11px] text-[#6a8fc0] mb-2">Free Account</p>

                <h2 className="text-white text-2xl font-extrabold mb-5">
                    Create Account
                </h2>

                {/* Inputs */}
                <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    className="w-full p-4 mb-3 rounded-lg border border-[rgba(100,140,220,0.25)]
          bg-[rgba(10,30,80,0.5)] text-[#c8d8f0] text-sm outline-none
          placeholder:text-[#5a7aaa] focus:border-[#4d8eff]"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    className="w-full p-4 mb-3 rounded-lg border border-[rgba(100,140,220,0.25)]
          bg-[rgba(10,30,80,0.5)] text-[#c8d8f0] text-sm outline-none
          placeholder:text-[#5a7aaa] focus:border-[#4d8eff]"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    className="w-full p-4 mb-3 rounded-lg border border-[rgba(100,140,220,0.25)]
          bg-[rgba(10,30,80,0.5)] text-[#c8d8f0] text-sm outline-none
          placeholder:text-[#5a7aaa] focus:border-[#4d8eff]"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                {mutation.isError && (
                    <p className="text-error text-sm text-center">
                        {mutation.error?.response?.data?.message ||
                            mutation.error?.message ||
                            "Something went wrong"}
                    </p>
                )}

                {/* Button */}
                <button
                    className="w-full p-4 mt-2 rounded-xl text-white text-base font-bold cursor-pointer
          bg-[linear-gradient(180deg,#4a7de8_0%,#2a5fd6_100%)]
          shadow-[0_6px_24px_rgba(42,95,214,0.55)]
          hover:bg-[linear-gradient(180deg,#5a8df0_0%,#3a6fe0_100%)]"
                    onClick={handleSubmit}
                >
                    Create Account
                </button>

                {/* Sign in link */}
                <p className="text-[#8aaad4] text-sm mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#4d8eff]">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
