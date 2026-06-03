// AssignmentsTab.jsx
import { useState } from "react";
import {
    ChevronDown,
    Clock,
    Trash2,
    Plus,
    CheckCircle,
    Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSubjectAssignments from "../../hooks/useSubjectAssignments";
import useCompletedAssignments from "../../hooks/useCompletedAssignments";
import { editAssignment, deleteAssignment } from "../../api/assignment.api";
import moment from "moment";

const getDueBadge = (dueDate) => {
    const diff = moment(dueDate).diff(moment(), "days");
    if (diff <= 1)
        return {
            label: diff < 0 ? "Overdue" : "Due tomorrow",
            cls: "bg-red-100 text-red-700",
        };
    if (diff <= 4)
        return {
            label: `Due in ${diff} days`,
            cls: "bg-amber-100 text-amber-700",
        };
    return {
        label: moment(dueDate).format("MMM D"),
        cls: "bg-green-100 text-green-700",
    };
};

const AssignmentRow = ({ assignment, onComplete, onDelete }) => {
    const [done, setDone] = useState(false);
    const badge = getDueBadge(assignment.dueDate);

    const handleComplete = () => {
        setDone(true);
        setTimeout(() => onComplete(assignment), 400);
    };
    const navigate = useNavigate();

    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 group ${
                done ? "opacity-0" : "opacity-100"
            } transition-all duration-300`}
        >
            {/* Check button */}
            <button
                onClick={handleComplete}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all
                    ${done ? "bg-[#7F77DD] border-[#7F77DD]" : "border-[#AFA9EC] hover:border-[#7F77DD] hover:bg-[#E2DBF0]"}`}
            >
                {done && <Check size={10} className="text-white" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-medium leading-snug ${
                        done ? "line-through text-gray-400" : "text-[#1A1A2E]"
                    }`}
                    onClick={() =>
                        navigate(`/assignments/${assignment._id}/edit`)
                    }
                >
                    {assignment.title}
                </p>
                {assignment.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {assignment.description}
                    </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.cls}`}
                    >
                        <Clock size={10} />
                        {badge.label}
                    </span>
                </div>
            </div>

            {/* Delete */}
            <button
                onClick={() => onDelete(assignment._id)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
};

const SubjectBlock = ({ subject }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const navigate = useNavigate();

    // Fetch pending assignments for this subject
    const { data: assignments = [], isLoading } = useSubjectAssignments(
        subject._id,
    );

    // Fetch completed assignments for this subject — only when expanded
    const { data: completed = [], refetch: fetchCompleted } =
        useCompletedAssignments(subject._id);

    const handleShowCompleted = () => {
        if (!showCompleted) fetchCompleted();
        setShowCompleted((v) => !v);
    };

    // Mark assignment as complete
    const { mutate: markComplete } = useMutation({
        mutationFn: (assignment) =>
            editAssignment({
                assignmentId: assignment._id,
                status: "completed",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries([
                "assignments",
                "subject",
                subject._id,
            ]);
            queryClient.invalidateQueries([
                "assignments",
                "subject",
                subject._id,
                "completed",
            ]);
        },
    });

    // Delete assignment
    const { mutate: removeAssignment } = useMutation({
        mutationFn: (assignmentId) => deleteAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries([
                "assignments",
                "subject",
                subject._id,
            ]);
        },
    });

    if (isLoading) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                        {subject.subjectName}
                    </span>
                    <span className="text-xs font-semibold bg-[#E2DBF0] text-[#534AB7] px-2.5 py-0.5 rounded-full">
                        {assignments.length}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Assignments */}
            {open && (
                <div className="border-t border-gray-100">
                    {assignments.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                            <button className="w-full bg-white p-4 flex flex-col items-center gap-2 text-[#8070AA]">
                                <span
                                    className="text-xs font-bold"
                                    onClick={() =>
                                        navigate(
                                            `/subjects/${subject._id}/assignments/add`,
                                        )
                                    }
                                >
                                    Add an assignment
                                </span>
                                <span className="text-[11px] font-medium text-[#B0A0CC]">
                                    Tap to get started
                                </span>
                            </button>
                        </p>
                    ) : (
                        assignments.map((a) => (
                            <AssignmentRow
                                key={a._id}
                                assignment={a}
                                onComplete={markComplete}
                                onDelete={removeAssignment}
                            />
                        ))
                    )}

                    {/* Completed toggle */}
                    <button
                        onClick={handleShowCompleted}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-[#7F77DD] bg-[#EEEDFE] border-t border-[#CECBF6] hover:bg-[#E2DBF0] transition-colors"
                    >
                        <CheckCircle size={13} />
                        {showCompleted
                            ? "Hide completed"
                            : `Show completed (${completed.length})`}
                    </button>

                    {showCompleted &&
                        completed.map((a) => (
                            <div
                                key={a._id}
                                className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 opacity-50"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#7F77DD] flex items-center justify-center shrink-0">
                                    <Check size={10} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm line-through text-gray-400">
                                        {a.title}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        Completed{" "}
                                        {moment(a.completedOn).format("MMM D")}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

const AssignmentsTab = ({ subjects }) => {
    if (!subjects?.length)
        return (
            <p className="text-sm text-[#8070AA] font-semibold text-center mt-10">
                No subjects found.
            </p>
        );

    return (
        <div className="flex flex-col gap-3 w-full">
            {subjects.map((subject) => (
                <SubjectBlock key={subject._id} subject={subject} />
            ))}
        </div>
    );
};

export default AssignmentsTab;
