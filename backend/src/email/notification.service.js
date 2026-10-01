import { sendEmail } from "../email/email.service.js";

export async function sendNotificationEmail({
  to,
  subject,
  text,
  html,
}) {
  try {
    const result = await sendEmail({
      to,
      subject,
      text,
      html,
    });

    console.log("Notification email sent:", {
      to,
      subject,
      messageId: result.messageId,
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error("Notification email failed:", {
      to,
      subject,
      error: error.message,
    });

    return {
      success: false,
      error: error.message,
    };
  }
}