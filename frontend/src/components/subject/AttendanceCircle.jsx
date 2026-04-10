import { COLORMAP } from "../../lib/configuration.js";
const AttendanceCircle = ({ percentage, status }) => {
    return (
        <div
            className={`w-14 h-14 flex items-center justify-center rounded-full border-4 font-semibold ${COLORMAP[status]}`}
        >
            {percentage}%
        </div>
    );
};

export default AttendanceCircle;
