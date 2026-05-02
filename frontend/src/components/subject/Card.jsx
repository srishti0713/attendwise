import Button from "../buttons/Button.jsx";
import { Check, X, Ban } from "lucide-react";
import AttendanceCircle from "./AttendanceCircle.jsx";

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

const Card = ({ subject, percentage, status, classesToSafe, classesToGoal }) => {
    const styles = CARD_STYLES[status] ?? CARD_STYLES.danger;

    return (
        <div className={`${styles.card} rounded-2xl p-4 w-full max-w-2xl mx-auto`}>
            {/* Top Section */}
            <div className="flex flex-col gap-3 mb-2">
                <div className="flex gap-4 items-center">
                    <AttendanceCircle percentage={percentage} status={status} />
                    <h2 className="text-lg font-semibold text-gray-800">{subject}</h2>
                </div>
                <div className="px-2 pb-1">
                    <p className="text-sm text-gray-700">
                        {classesToSafe > 0
                            ? `You need to attend ${classesToSafe} classes`
                            : classesToGoal > 0
                              ? `You need to attend ${classesToGoal} classes`
                              : ""}
                    </p>
                </div>
            </div>

            {/* Assignment + Action Buttons */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mx-2">
                    <Button
                        className={`btn-sm flex-1 font-semibold rounded-xl ${styles.button}`}
                        variant=""
                    >
                        + Add Assignment
                    </Button>

                    <div className="flex gap-2 items-center">
                        <Button
                            className={`btn-xs btn-circle border-none shadow-none rounded-xl w-9 h-9 ${styles.ban}`}
                            variant=""
                        >
                            <Ban size={16} />
                        </Button>
                        <Button
                            className={`btn-xs btn-circle border-none shadow-none rounded-xl w-9 h-9 ${styles.check}`}
                            variant=""
                        >
                            <Check size={16} />
                        </Button>
                        <Button
                            className={`btn-xs btn-circle border-none shadow-none rounded-xl w-9 h-9 ${styles.x}`}
                            variant=""
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;