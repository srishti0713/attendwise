import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/buttons/Button.jsx";
import { addAssignment } from "../../api/assignment.api.js";

// Shared primitives 

const ErrorBanner = ({ message }) =>
    message ? (
        <div className="bg-[#FEF0F0] border border-[#FDDCDC] rounded-2xl px-5 py-3 mb-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E57373] shrink-0" />
            <p className="text-sm font-semibold text-[#C0392B]">{message}</p>
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



const AddAssignmentPage = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: addAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["assignments", subjectId],
            });
            navigate(-1);
        },
        onError: (err) => {
            setError(
                err?.response?.data?.message || "Failed to add assignment",
            );
        },
    });

    const handleSubmit = () => {
        setError("");
        mutation.mutate({
            subjectId,
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate,
        });
    };

    return (
        <div className="w-full max-w-lg mx-auto pb-24">
            {/* Header */}
            <div className="mb-4">
                <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">
                    New assignment
                </h1>
                <p className="text-sm text-[#8070AA] mt-1">
                    Fill in the details below
                </p>
            </div>

            <ErrorBanner message={error} />

            {/* Form card */}
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-5 mb-3">
                <p className="text-[11px] font-bold tracking-widest uppercase text-[#8070AA] mb-4">
                    Assignment info
                </p>

                <div className="flex flex-col gap-3">
                    <Field label="Title">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Essay on Climate Change"
                            className={inputClass}
                            disabled={mutation.isPending}
                            autoFocus
                        />
                    </Field>

                    <Field label="Description (optional)">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Any notes or details about this assignment…"
                            rows={3}
                            className={`${inputClass} resize-none`}
                            disabled={mutation.isPending}
                        />
                    </Field>

                    <Field label="Due date">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className={inputClass}
                            disabled={mutation.isPending}
                        />
                    </Field>
                </div>
            </div>

            <div className="h-px bg-[#F0EBF8] mb-3" />

            <Button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="bg-[#1A1A2E] text-white border-none rounded-xl py-3 text-sm font-bold mb-3"
                fullWidth
            >
                {mutation.isPending ? "Adding…" : "Add assignment"}
            </Button>

            <Button
                onClick={() => navigate(-1)}
                disabled={mutation.isPending}
                className="bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                fullWidth
            >
                ← Back
            </Button>
        </div>
    );
};

export default AddAssignmentPage;