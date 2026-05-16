import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendDueDateEmail = async (
    name,
    to,
    assignmentName,
    description,
    dueDate,
) => {
    try {
        const formattedDate = new Date(dueDate).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
        });

        //Email description
        await transporter.sendMail({
            from: `"AttendWise" <${process.env.EMAIL_USER}>`,
            to,
            subject: `📚 Assignment Due Reminder: ${assignmentName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4F46E5;">AttendWise - Assignment Reminder</h2>
          <p>Hi ${name},</p>
          <p>This is a reminder that your assignment is due soon:</p>

          <div style="background: #F3F4F6; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p><strong>📝 Assignment:</strong> ${assignmentName}</p>
            ${
                description
                    ? `<p><strong>📄 Description:</strong> ${description}</p>`
                    : ""
            }
            <p><strong>⏰ Due Date:</strong> ${formattedDate}</p>
          </div>

          <p>Please make sure to submit your assignment before the deadline.</p>
          <p style="color: #6B7280; font-size: 13px;">— The AttendWise Team</p>
        </div>
      `,
        });

        console.log(`Due date email sent to ${to}`);
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};

export const sendAttendanceWarningEmail = async (name, to, subjects, safe) => {
    try {
        const subjectRows = subjects.map((s) => `
            <!-- Desktop row -->
            <tr class="desktop-row">
                <td style="padding: 10px; border: 1px solid #e0e0e0;">
                    ${s.subjectName}
                </td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; text-align: center;">
                    ${s.attended}/${s.total}
                </td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; text-align: center; color: #DC2626; font-weight: bold;">
                    ${s.percentage.toFixed(1)}%
                </td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; text-align: center; color: #D97706;">
                    ${s.classesToSafeZone} class(es)
                </td>
                <td style="padding: 10px; border: 1px solid #e0e0e0; color: #6B7280; font-size: 13px;">
                    ${s.message}
                </td>
            </tr>
        `).join("");

        // Mobile cards — one card per subject
        const mobileCards = subjects.map((s) => `
            <div class="mobile-card" style="background: #F9FAFB; border: 1px solid #e0e0e0; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
                <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px; color: #111827;">
                    ${s.subjectName}
                </p>
                <p style="margin: 4px 0; font-size: 13px; color: #374151;">
                    📊 <strong>Attended:</strong> ${s.attended}/${s.total}
                </p>
                <p style="margin: 4px 0; font-size: 13px; color: #DC2626; font-weight: bold;">
                    📉 <strong>Current:</strong> ${s.percentage.toFixed(1)}%
                </p>
                <p style="margin: 4px 0; font-size: 13px; color: #D97706;">
                    🎯 <strong>Classes Needed:</strong> ${s.classesToSafeZone} class(es)
                </p>
                <p style="margin: 4px 0; font-size: 13px; color: #6B7280;">
                    💬 ${s.message}
                </p>
            </div>
        `).join("");

        await transporter.sendMail({
            from: `"AttendWise" <${process.env.EMAIL_USER}>`,
            to,
            subject: `⚠️ Attendance Warning: You have at-risk classes today!`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                        /* Show table on desktop, hide mobile cards */
                        .mobile-card  { display: none; }
                        .desktop-row  { display: table-row; }
                        .table-wrap   { overflow-x: auto; }

                        @media only screen and (max-width: 600px) {
                            /* Hide table, show cards */
                            .desktop-row        { display: none !important; }
                            .desktop-thead      { display: none !important; }
                            .mobile-card        { display: block !important; }

                            /* Comfortable padding on small screens */
                            .outer              { padding: 16px !important; }
                            .warning-box        { font-size: 13px !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background: #f4f4f5;">
                    <div class="outer" style="font-family: Arial, sans-serif; max-width: 680px; margin: auto; padding: 24px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">

                        <h2 style="color: #DC2626; margin-top: 0;">AttendWise — Attendance Warning</h2>
                        <p>Hi ${name},</p>
                        <p>
                            You have <strong>class(es) today</strong> where your attendance
                            is below your safe threshold of <strong>${safe}%</strong>.
                            Attending today can help you recover.
                        </p>

                        <!-- Desktop: table -->
                        <div class="table-wrap">
                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                                <thead class="desktop-thead">
                                    <tr style="background: #F3F4F6;">
                                        <th style="padding: 10px; border: 1px solid #e0e0e0; text-align: left;">Subject</th>
                                        <th style="padding: 10px; border: 1px solid #e0e0e0;">Attended/Total</th>
                                        <th style="padding: 10px; border: 1px solid #e0e0e0;">Current %</th>
                                        <th style="padding: 10px; border: 1px solid #e0e0e0;">Classes Needed</th>
                                        <th style="padding: 10px; border: 1px solid #e0e0e0;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${subjectRows}
                                </tbody>
                            </table>
                        </div>

                        <!-- Mobile: cards -->
                        <div style="margin: 16px 0;">
                            ${mobileCards}
                        </div>

                        <p class="warning-box" style="color: #92400E; background: #FEF3C7; padding: 12px; border-radius: 6px; font-size: 14px;">
                            ⚠️ Missing today's class(es) will worsen your attendance status. Please attend!
                        </p>
                        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">— The AttendWise Team</p>
                    </div>
                </body>
                </html>
            `,
        });

        console.log(`Attendance warning email sent to ${to}`);
    } catch (error) {
        console.error("Attendance warning email error:", error);
        throw error;
    }
};
