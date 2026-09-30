import "dotenv/config";
import { sendEmail } from "../email/email.service.js";

async function testSendEmail() {
  try {
    const result = await sendEmail({
      to: process.env.SMTP_USER,
      subject: "TripSphere Email Test",
      text: "Your TripSphere email service is working.",
      html: `
        <h2>Welcome to TripSphere!</h2>
        <p>Your email service is working successfully.</p>
      `,
    });

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error(error.message);
  }
}

testSendEmail();