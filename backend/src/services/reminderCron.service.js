import cron from "node-cron";
import Assignment from "../models/assignment.model.js";
import { sendDueDateEmail } from "./mailer.service.js";

export const startReminderCron = () => {
    cron.schedule(
        "0 */8 * * *",
        async () => {
            console.log("Running AttendWise assignment reminder cron...");

            const now = new Date(
                new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kolkata",
                }),
            );

            // Start of tomorrow (00:00)
            const startOfTomorrow = new Date();
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            startOfTomorrow.setHours(0, 0, 0, 0);

            // End of tomorrow (23:59)
            const endOfTomorrow = new Date();
            endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
            endOfTomorrow.setHours(23, 59, 59, 999);

            try {
                const assignments = await Assignment.find({
                    reminderSent: false,
                    dueDate: {
                        $gte: startOfTomorrow,
                        $lte: endOfTomorrow,
                    },
                }).populate("userId", "email name"); // Populating user's email and name

                if (assignments.length === 0) {
                    console.log("No upcoming assignments to remind.");
                    return;
                }

                // Sending email of all assignments that are due the next day
                for (const assignment of assignments) {
                    const user = assignment.userId;

                    if (!user?.email) {
                        console.warn(
                            `No email found for assignment: ${assignment.title}`,
                        );
                        continue;
                    }

                    await sendDueDateEmail(
                        user.name,
                        user.email,
                        assignment.title,
                        assignment.description,
                        assignment.dueDate,
                    );

                    assignment.reminderSent = true;
                    await assignment.save();

                    console.log(
                        `Reminder sent to ${user.email} for "${assignment.title}"`,
                    );
                }

                console.log(
                    `Reminders sent for ${assignments.length} assignment(s).`,
                );
            } catch (error) {
                console.error("Cron error:", error);
            }
        },
        {
            timezone: "Asia/Kolkata",
        },
    );
};
