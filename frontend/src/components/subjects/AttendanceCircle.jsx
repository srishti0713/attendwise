const AttendanceCircle = ({ percentage, status }) => {
  const colorMap = {
    danger: "border-red-500 text-red-500",
    moderate: "border-yellow-500 text-yellow-500",
    safe: "border-green-500 text-green-500",
  };

  return (
    <div
      className={`w-14 h-14 flex items-center justify-center rounded-full border-4 font-semibold ${colorMap[status]}`}
    >
      {percentage}%
    </div>
  );
};

export default AttendanceCircle;