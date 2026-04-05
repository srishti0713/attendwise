import React from "react";
import Button from "../buttons/Button.jsx";
import { Check, X, Ban } from "lucide-react";

const Card = ({ subject, percentage }) => {
    return (
        <div className="card bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 w-full max-w-sm mx-auto">
            {/* Top Section - Subject + Percentage */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                    {subject}
                </h2>
                {/* <div className="badge badge-primary text-white px-3 py-2 text-sm">
                    {percentage}%
                </div> */}
            </div>

            {/* Assignment + Action Buttons */}
            <div className="flex flex-col gap-3">
                {/* Row: Add Assignment + Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="btn-sm flex-1" variant="outline">
                        + Add Assignment
                    </Button>

                    <div className="flex gap-2 justify-center">
                        <Button className="btn-xs btn-circle" variant="neutral">
                            <Ban />
                        </Button>
                        <Button className="btn-xs btn-circle" variant="success">
                            <Check />
                        </Button>
                        <Button className="btn-xs btn-circle" variant="error">
                            <X />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
