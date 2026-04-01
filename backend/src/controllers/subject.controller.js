import Subject from "../models/subject.model";
import User from "../models/user.model";
import Semester from "../models/semester.model";

export const getSubjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        const subjects = await Subject.find({ userId });

        const result = subjects.map((subject) => {
            const attended = subject.attendedClasses;
            const total = subject.totalClasses;

            const current =
                total === 0 ? 0 : (attended / total) * 100;

            const min = user.safePercentage;
            const max = user.targetPercentage;

            const safeNeeded = classesNeeded(attended, total, min);
            const goalNeeded = classesNeeded(attended, total, max);

            let status, message;

            if (current < min) {
                status = "danger";
                message = `Attend ${safeNeeded} classes to reach ${min}%`;
            } else if (current < max) {
                status = "moderate";
                message = `Safe. Attend ${goalNeeded} more to reach ${max}%`;
            } else {
                status = "safe";
                message = `Above ${max}%`;
            }

            return {
                ...subject.toObject(),
                attendancePercentage: Number(current.toFixed(2)),
                classesToSafeZone: safeNeeded,
                classesToGoal: goalNeeded,
                status,
                message,
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return throwError(res, error, "getSubjects");
    }
};