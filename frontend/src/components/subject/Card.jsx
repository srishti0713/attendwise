import Button from "../buttons/Button.jsx";
import { Check, X, Ban } from "lucide-react";
import AttendanceCircle from "./AttendanceCircle.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubject } from "../../api/subject.api.js";

const CARD_STYLES = {
    safe: {
        card: "bg-[#B8E8CC] border border-[#8FD4AA]",
        button: "bg-[#2E8B57] text-white hover:bg-[#256E45] border-none",
        ban: "bg-[#D6CBFA] text-[#4A20C4]",
        check: "bg-[#8FD4AA] text-[#1A5C38]",
        x: "bg-[#F0ABBE] text-[#7A1530]",
    },
    moderate: {
        card: "bg-[#F5E6A3] border border-[#E8CC6A]",
        button: "bg-[#C97A00] text-white hover:bg-[#A66200] border-none",
        ban: "bg-[#D6CBFA] text-[#4A20C4]",
        check: "bg-[#8FD4AA] text-[#1A5C38]",
        x: "bg-[#F0ABBE] text-[#7A1530]",
    },
    danger: {
        card: "bg-[#F5B8C8] border border-[#E88FA8]",
        button: "bg-[#C0355A] text-white hover:bg-[#9E2748] border-none",
        ban: "bg-[#D6CBFA] text-[#4A20C4]",
        check: "bg-[#8FD4AA] text-[#1A5C38]",
        x: "bg-[#F0ABBE] text-[#7A1530]",
    },
};

const Card = ({
    subject,
    percentage,
    status,
    classesToSafe,
    classesToGoal,
    canMiss,
    semesterId,
    subjectId,
}) => {
    const styles = CARD_STYLES[status] ?? CARD_STYLES.danger;

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (attendanceStatus) =>
            updateSubject(subjectId, {
                date: new Date().toISOString(),
                status: attendanceStatus,
            }),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ["timetable", semesterId],
            });
        },
    });

    // Derive message from props — works for both 2-level and 3-level modes
    const getInfoMessage = () => {
        if (classesToSafe > 0) {
            return `You need to attend ${classesToSafe} ${classesToSafe === 1 ? "class" : "classes"} to reach safe zone`;
        }
        if (classesToGoal > 0) {
            return `Attend ${classesToGoal} ${classesToGoal === 1 ? "class" : "classes"} more to reach goal`;
        }
        if (canMiss > 0) {
            return `You can miss ${canMiss} ${canMiss === 1 ? "class" : "classes"}`;
        }
        if (status === "safe") {
            return "Attend every class to stay safe";
        }
        return "";
    };

    const infoMessage = getInfoMessage();

    return (
        <div
            className={`${styles.card} rounded-2xl px-8 py-4 w-full overflow-hidden`}
        >
            {/* Top Section */}
            <div className="flex flex-col gap-2 mb-3">
                <div className="flex gap-4 items-center">
                    <AttendanceCircle percentage={percentage} status={status} />
                    <h2 className="text-lg font-semibold text-gray-800">
                        {subject}
                    </h2>
                </div>
                {infoMessage && (
                    <p className="text-sm text-gray-700 pl-1">{infoMessage}</p>
                )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-2 w-full">
                <Button
                    className={`btn-sm font-semibold rounded-xl shrink-0 ${styles.button}`}
                    variant=""
                >
                    + Add Assignment
                </Button>
                <div className="flex gap-2 ml-auto shrink-0">
                    <Button
                        className={`btn-sm border-[#6639ed] shadow-sm rounded-xl w-9 h-9 ${styles.ban}`}
                        variant=""
                        onClick={() => mutate("off")}
                        disabled={isPending}
                    >
                        <Ban size={16} />
                    </Button>
                    <Button
                        className={`btn-sm border-[#45685a] shadow-sm rounded-xl w-9 h-9 ${styles.check}`}
                        variant=""
                        onClick={() => mutate("attended")}
                        disabled={isPending}
                    >
                        <Check size={16} />
                    </Button>
                    <Button
                        className={`btn-sm border-[#893e53] shadow-sm rounded-xl w-9 h-9 ${styles.x}`}
                        variant=""
                        onClick={() => mutate("missed")}
                        disabled={isPending}
                    >
                        <X size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Card;
