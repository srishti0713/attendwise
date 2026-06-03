import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/buttons/Button.jsx";
import { getAssignment, editAssignment, deleteAssignment } from "../../api/assignment.api.js";

// ── Shared primitives ─────────────────────────────────────────────────────────

const ErrorBanner = ({ message }) =>
    message ? (
        <div className="bg-[#FEF0F0] border border-[#FDDCDC] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E57373] shrink-0" />
            <p className="text-sm font-semibold text-[#C0392B]">{message}</p>
        </div>
    ) : null;

const SuccessBanner = ({ message }) =>
    message ? (
        <div className="bg-[#E6F7EF] border border-[#9FD9B8] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2E7D55] shrink-0" />
            <p className="text-sm font-semibold text-[#2E7D55]">{message}</p>
        </div>
    ) : null;

const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-[#6B52B5]">{label}</label>
        {children}
    </div>
);

const inputClass =
    "bg-[#F5F0FF] border border-[#E2DBF0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1A1A2E] outline-none focus:border-[#9B72F5] w-full placeholder:text-[#C4B0F7] disabled:opacity-60";

// ── Delete confirmation modal ─────────────────────────────────────────────────

const DeleteModal = ({ onConfirm, onCancel, isPending }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
            className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm"
            onClick={onCancel}
        />
        <div className="relative bg-white border border-[#E2DBF0] rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-3">
                Delete assignment
            </p>
            <p className="text-sm font-medium text-[#1A1A2E] mb-5">
                This assignment will be permanently deleted. This action cannot
                be undone.
            </p>
            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex-1 bg-[#E8E0F8] text-[#4A20C4] rounded-xl py-2.5 text-sm font-bold disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isPending}
                    className="flex-1 bg-[#E57373] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#D45C5C] transition-colors disabled:opacity-50"
                >
                    {isPending ? "Deleting…" : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const EditAssignmentPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [prefilled, setPrefilled] = useState(false);

    // ── Query ─────────────────────────────────────────────────────────────────

    const { isLoading, data: assignment } = useQuery({
        queryKey: ["assignment", assignmentId],
        queryFn: () => getAssignment(assignmentId),
    });

    // Pre-fill once data arrives — guard with prefilled flag so edits aren't overwritten on refetch
    if (assignment && !prefilled) {
        setTitle(assignment.title);
        setDescription(assignment.description || "");
        setDueDate(assignment.dueDate?.split("T")[0] ?? "");
        setPrefilled(true);
    }

    // ── Mutations ─────────────────────────────────────────────────────────────

    const editMutation = useMutation({
        mutationFn: editAssignment,
        onSuccess: () => {
            setSuccess("Assignment updated");
            setError("");
            queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            setTimeout(() => setSuccess(""), 3000);
        },
        onError: (err) => {
            setError(
                err?.response?.data?.message || "Failed to update assignment",
            );
            setSuccess("");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assignments"] });
            navigate(-1);
        },
        onError: (err) => {
            setShowDeleteModal(false);
            setError(
                err?.response?.data?.message || "Failed to delete assignment",
            );
        },
    });

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSave = () => {
        setError("");
        setSuccess("");
        editMutation.mutate({
            assignmentId,
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate,
        });
    };

    // ── Loading skeleton ──────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="w-full max-w-lg mx-auto pb-24">
                <div className="mb-4">
                    <div className="h-7 w-48 bg-[#E8E0F8] rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-36 bg-[#F0EBF8] rounded-lg animate-pulse" />
                </div>
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3 flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="h-3 w-16 bg-[#F0EBF8] rounded animate-pulse" />
                            <div className="h-10 bg-[#F5F0FF] rounded-xl animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const isPending = editMutation.isPending;

    return (
        <>
            {showDeleteModal && (
                <DeleteModal
                    onConfirm={() => deleteMutation.mutate()}
                    onCancel={() => setShowDeleteModal(false)}
                    isPending={deleteMutation.isPending}
                />
            )}

            <div className="w-full max-w-lg mx-auto pb-24">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                        Edit assignment
                    </h1>
                    <p className="text-sm text-[#8070AA] mt-1">
                        Update the details below
                    </p>
                </div>

                <ErrorBanner message={error} />
                <SuccessBanner message={success} />

                {/* Fields card */}
                <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                        Assignment info
                    </p>

                    <div className="flex flex-col gap-3 mb-4">
                        <Field label="Title">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={inputClass}
                                disabled={isPending}
                            />
                        </Field>

                        <Field label="Description (optional)">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Any notes or details…"
                                rows={3}
                                className={`${inputClass} resize-none`}
                                disabled={isPending}
                            />
                        </Field>

                        <Field label="Due date">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className={inputClass}
                                disabled={isPending}
                            />
                        </Field>
                    </div>

                    <div className="h-px bg-[#F0EBF8] mb-4" />

                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold"
                        fullWidth
                    >
                        {isPending ? "Saving…" : "Save changes"}
                    </Button>
                </div>

                {/* Danger zone */}
                <div className="bg-white border border-[#FDDCDC] rounded-2xl p-5 mb-3">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-[#E57373] mb-3">
                        Danger zone
                    </p>
                    <Button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isPending || deleteMutation.isPending}
                        className="bg-[#FEF0F0] text-[#C0392B] border-none rounded-xl py-3 text-sm font-bold hover:bg-[#FDDCDC]"
                        fullWidth
                    >
                        Delete assignment
                    </Button>
                </div>

                <Button
                    onClick={() => navigate(-1)}
                    disabled={isPending}
                    className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                    fullWidth
                >
                    ← Back
                </Button>
            </div>
        </>
    );
};

export default EditAssignmentPage;