import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/buttons/Button.jsx";
import { useState } from "react";
import { logout } from "../../api/auth.api.js";
import { deleteUser } from "../../api/user.api.js"
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "../../components/confirmModal/ConfirmModal.jsx";

const ProfilePage = () => {
    const { data: user, isLoading } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [modal, setModal] = useState(null); // "logout" | "delete" | null

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = async () => {
        try {
            await logout();
            queryClient.clear();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setModal(null);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser();
            queryClient.clear();
            navigate("/login");
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setModal(null);
        }
    };


    if (isLoading) return <p className="text-center text-[#8070AA] font-medium mt-10">Loading...</p>;
    if (!user) return <p className="text-center text-[#8070AA] font-medium mt-10">User not found</p>;

    return (
        <>
        {modal === "logout" && (
                <ConfirmModal
                    title="Log out?"
                    message="You will be signed out of your account and redirected to the login page."
                    confirmLabel="Log out"
                    confirmClass="bg-[#F5E6A3] text-[#7A4A00]"
                    onConfirm={handleLogout}
                    onCancel={() => setModal(null)}
                />
            )}

            {modal === "delete" && (
                <ConfirmModal
                    title="Delete account?"
                    message="This will permanently delete your account, all subjects, semesters, attendance records and assignments. This cannot be undone."
                    confirmLabel="Delete account"
                    confirmClass="bg-[#F5B8C8] text-[#7A1530]"
                    onConfirm={handleDelete}
                    onCancel={() => setModal(null)}
                />
            )}

        <div className="w-full max-w-lg mx-auto pb-24">

            {/* Hero */}
            <div className="bg-[#D6CBFA] border border-[#C4B0F7] rounded-3xl p-6 flex flex-col items-center gap-3 mb-3">
                <div className="w-[72px] h-[72px] rounded-full bg-[#9B72F5] flex items-center justify-center text-white font-playfair text-2xl font-bold">
                    {getInitials(user.name)}
                </div>
                <div className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    {user.name}
                </div>
                <div className="text-sm font-semibold text-[#6B52B5] bg-[#EDE8F5] px-4 py-1 rounded-full">
                    {user.email}
                </div>
                <div className="text-xs text-[#B0A0CC] font-medium">
                    Member since {moment(user.createdAt).format("MMMM YYYY")}
                </div>
            </div>

            {/* Account Info */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Account
                </p>
                <div className="flex items-center justify-between py-3 border-b border-[#F0EBF8]">
                    <span className="text-xs font-semibold text-[#8070AA]">Full name</span>
                    <span className="text-sm font-semibold text-[#1A1A2E]">{user.name}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                    <span className="text-xs font-semibold text-[#8070AA]">Email</span>
                    <span className="text-sm font-semibold text-[#1A1A2E]">{user.email}</span>
                </div>
            </div>

            {/* Attendance Targets */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Attendance targets
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#B8E8CC] border border-[#8FD4AA] rounded-2xl p-4 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#1A5C38]">
                            Safe zone
                        </span>
                        <span className="font-playfair text-4xl font-bold text-[#2E8B57] leading-none">
                            {user.safePercentage}%
                        </span>
                        <span className="text-xs font-medium text-[#2E8B57]">minimum</span>
                    </div>
                    <div className="bg-[#D6CBFA] border border-[#C4B0F7] rounded-2xl p-4 flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A20C4]">
                            Target
                        </span>
                        <span className="font-playfair text-4xl font-bold text-[#6B52B5] leading-none">
                            {user.targetPercentage}%
                        </span>
                        <span className="text-xs font-medium text-[#8070AA]">goal</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Actions
                </p>
                <div className="flex flex-row gap-3">
                    <Button
                        onClick={() => navigate("/profile/edit")}
                        className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold flex-1"
                        
                    >
                        Edit profile
                    </Button>
                    <Button
                        onClick={() => navigate("/logout")}
                        className="bg-[#F5E6A3] text-[#7A4A00] border border-[#E8CC6A] rounded-xl py-3 text-sm font-bold flex-1"
                        
                    >
                        Log out
                    </Button>
                    <Button
                        onClick={() => navigate("/profile/delete")}
                        className="bg-[#F5B8C8] text-[#7A1530] border border-[#E88FA8] rounded-xl py-3 text-sm font-bold flex-1"
                    >
                        Delete account
                    </Button>
                </div>
            </div>

        </div>
        </>
    );
};

export default ProfilePage;