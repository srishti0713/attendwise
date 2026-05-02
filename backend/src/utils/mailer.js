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
