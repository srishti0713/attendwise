import { COLORMAP } from "../../lib/configuration";
const AttendanceCircle = ({ percentage, status }) => {
    return (
        <div
            className={`w-14 h-14 flex items-center justify-center rounded-full border-4 font-semibold text-sm shrink-0 ${COLORMAP[status]}`}
        >
            {percentage}%
        </div>
    );
};

export default AttendanceCircle;