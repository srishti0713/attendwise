import { COLORMAP } from "../../lib/configuration";
const AttendanceCircle = ({ percentage, status }) => {
    return (
        <div
            className={`w-16 h-16 flex items-center justify-center rounded-full  border-4 font-semibold text-sm shrink-0 ${COLORMAP[status]}`}
        >
            {percentage}%
        </div>
    );
};

export default AttendanceCircle;