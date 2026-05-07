import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/buttons/Button.jsx";
import useAuth from "../../hooks/useAuth.js";
import { updateProfile } from "../../api/user.api.js";

const EditProfilePage = () => {
    const { data: user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    const [error, setError] = useState("");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [safePercentage, setSafePercentage] = useState(
        user?.safePercentage || 60,
    );
    const [targetPercentage, setTargetPercentage] = useState(
        user?.targetPercentage || 75,
    );

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/profile");
        },
    });

    // Saving name and email only
    const handleSaveInfo = (e) => {
        e.preventDefault();
        setError("");

        const data = new FormData();
        data.append("name", name);
        data.append("email", email);
        updateMutation.mutate(data);
    };

    // Saving new password
    const handleSavePassword = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All password fields are required");
            return;
        }

        // Confirm new password and confirm password are same
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        updateMutation.mutate({ oldPassword, newPassword, confirmPassword });
    };

    // Saving safe and target percentages
    const handleSaveTargets = () => {
        updateMutation.mutate({ safePercentage, targetPercentage });
    };

    // Make safe percent same as target percent
    const handleMatchTarget = () => {
        setSafePercentage(targetPercentage);
    };

    return (
        <div className="w-full max-w-lg mx-auto pb-24">
            {/* Page Header */}
            <div className="mb-4">
                <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    Edit profile
                </h1>
                <p className="text-sm text-[#8070AA] mt-1">
                    Changes are saved per section
                </p>
            </div>

            {/* Personal Info */}
            <form onSubmit={handleSaveInfo}>
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                        Personal info
                    </p>
                    {/* Name */}
                    <div className="flex flex-col gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[#6B52B5]">
                                Full name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[#6B52B5]">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full"
                            />
                        </div>
                    </div>
                    <div className="h-px bg-[#F0EBF8] mb-4" />
                    <Button
                        type="submit"
                        className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold"
                        fullWidth
                    >
                        Save info
                    </Button>
                </div>
            </form>

            {/* Change Password */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Change password
                </p>
                {/* Current Password */}
                <div className="flex flex-col gap-3 mb-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            Current password
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7]"
                        />
                    </div>

                    {/* New Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            New password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7]"
                        />
                    </div>

                    {/* Confirm new password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            Confirm new password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7]"
                        />
                    </div>
                </div>
                <div className="h-px bg-[#F0EBF8] mb-4" />
                <Button
                    onClick={handleSavePassword}
                    className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold"
                    fullWidth
                >
                    Update password
                </Button>
            </div>

            {/* Attendance Targets */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Attendance targets
                </p>

                {/* Safe percentage */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            Safe zone %
                        </label>
                        <input
                            type="number"
                            value={safePercentage}
                            onChange={(e) =>
                                setSafePercentage(Number(e.target.value))
                            }
                            min="1"
                            max="100"
                            className=" bg-[#F5E6A3]  border border-[#E8CC6A] rounded-xl px-4 py-2.5 text-lg font-playfair font-bold text-[#7A4A00] outline-none focus:border-[#E8CC6A] w-full text-center"
                        />
                    </div>

                    {/* Target Percentage */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B52B5]">
                            Target %
                        </label>
                        <input
                            type="number"
                            value={targetPercentage}
                            onChange={(e) =>
                                setTargetPercentage(Number(e.target.value))
                            }
                            min="1"
                            max="100"
                            className="bg-[#B8E8CC] border border-[#8FD4AA] rounded-xl px-4 py-2.5 text-lg font-playfair font-bold text-[#2E8B57] outline-none focus:border-[#2E8B57] w-full text-center"
                        />
                    </div>
                </div>

                {/* Set safe percent same as target percent */}
                <Button
                    onClick={handleMatchTarget}
                    className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-2.5 text-xs font-bold mb-3"
                    fullWidth
                >
                    Set safe same as target zone
                </Button>
                <div className="h-px bg-[#F0EBF8] mb-3" />
                <Button
                    onClick={handleSaveTargets}
                    className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold"
                    fullWidth
                    // disabled={isPending}
                >
                    Update targets
                </Button>
            </div>

            {/* Back */}
            <Button
                onClick={() => navigate("/profile")}
                className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                fullWidth
            >
                ← Back to profile
            </Button>
        </div>
    );
};

export default EditProfilePage;
