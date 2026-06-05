import cron from "node-cron";
import Timetable from "../models/timetable.model.js";
import Semester from "../models/semester.model.js";
import { sendAttendanceWarningEmail } from "./mailer.service.js";
import { getAttendanceStats } from "../utils/attendance.util.js";

export const startAttendanceWarningCron = () => {
    cron.schedule(
        "0 7 * * *",
        async () => {
            console.log("Running AttendWise attendance warning cron...");

            const todayName = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: "Asia/Kolkata",
            });

            try {
                const currentSemesterIds = await Semester.find({ isCurrent: true }).distinct("_id");
                
                const timetables = await Timetable.find({ semesterId: { $in: currentSemesterIds } }).populate({
                    path: `timetable.${todayName}`,
                    populate: {
                        path: "userId",
                        select: "name email attendanceThreshold",
                    },
                });


                const studentMap = {};

                for (const doc of timetables) {
                    const todaySubjects = doc.timetable?.[todayName] ?? [];

                    for (const subject of todaySubjects) {
                        if (!subject?.userId) continue;

                        const user = subject.userId;
                        if (!user?.email) continue;

                        const safe = user.safePercentage ?? 75;
                        const target = user.targetPercentage ?? 75;

                        // Use your actual util with the subject's attendance logs
                        const stats = getAttendanceStats(
                            subject.attendance ?? [],
                            safe,
                            target,
                        );

                        // Only warn if status is "danger" (below safe threshold)
                        if (stats.status !== "danger") continue;

                        const studentId = user._id.toString();

                        if (!studentMap[studentId]) {
                            studentMap[studentId] = {
                                user,
                                safe,
                                subjects: [],
                            };
                        }

                        studentMap[studentId].subjects.push({
                            subjectName: subject.subjectName,
                            attended: stats.attended,
                            total: stats.total,
                            percentage: stats.attendancePercentage,
                            classesToSafeZone: stats.classesToSafeZone,
                            message: stats.message,
                        });
                    }
                }

                const students = Object.values(studentMap);

                if (!students.length) {
                    console.log(
                        "All students are above their safe threshold today.",
                    );
                    return;
                }

                for (const { user, safe, subjects } of students) {
                    await sendAttendanceWarningEmail(
                        user.name,
                        user.email,
                        subjects,
                        safe,
                    );

                    console.log(
                        `Warning sent to ${user.email} | threshold: ${safe}% | subjects: ${subjects.length}`,
                    );
                }

                console.log(`Warnings sent to ${students.length} student(s).`);
            } catch (error) {
                console.error("Attendance cron error:", error);
            }
        },
        {
            timezone: "Asia/Kolkata",
        },
    );
};
