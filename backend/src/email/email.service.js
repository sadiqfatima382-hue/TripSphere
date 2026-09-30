import transporter from "../config/email.js";

export async function sendEmail({ to, subject, text, html, })
{
    try {
        const result = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            text,
            html,
        })
        return {
            messageId: result.messageId,
            accepted: result.accepted,
        };
    } catch (error) {
        console.error("Email sending failed:", error.message);

        throw new Error("Failed to send email");
    }
}


