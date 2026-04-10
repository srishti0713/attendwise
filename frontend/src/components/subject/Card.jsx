import Button from "../buttons/Button.jsx";
import { Check, X, Ban } from "lucide-react";
import AttendanceCircle from "./AttendanceCircle.jsx";

const Card = ({
    subject,
    percentage,
    status,
    classesToSafe,
    classesToGoal,
}) => {
    return (
        <div className="card bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 w-full max-w-sm mx-auto">
            {/* Top Section - Subject + Percentage */}
            <div className="flex flex-col gap-3  mb-2">
                <div className="flex gap-4 items-center">
                    <AttendanceCircle percentage={percentage} status={status} />
                    <h2 className="text-lg font-semibold text-gray-800">
                        {subject}
                    </h2>
                </div>
                <div className="px-2 pb-1">
                    <p className="text-sm text-black">
                        {classesToSafe > 0
                            ? ` You need to attend ${classesToSafe} classes`
                            : classesToGoal > 0
                              ? ` You need to attend ${classesToGoal} classes`
                              : ""}
                    </p>
                </div>
                {/* <div className="badge badge-primary text-white px-3 py-2 text-sm">
                    {percentage}%
                </div> */}
            </div>

            {/* Assignment + Action Buttons */}
            <div className="flex flex-col gap-3">
                {/* Row: Add Assignment + Buttons */}
                <div className="flex gap-2 mx-4">
                    <Button className="btn-sm flex-1" variant="ghost">
                        + Add Assignment
                    </Button>

                    <div className="flex gap-2 justify-center mt-1">
                        <Button
                            className="btn-xs btn-circle  bg-transparent shadow-none border-none text-orange-500"
                            variant="ghost"
                        >
                            <Ban />
                        </Button>
                        <Button
                            className="btn-xs btn-neutral  bg-transparent shadow-none border-none text-green-700"
                            variant="ghost"
                        >
                            <Check />
                        </Button>
                        <Button
                            className="btn-xs btn-circle  bg-transparent shadow-none border-none text-red-700"
                            variant="ghost"
                        >
                            <X />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
