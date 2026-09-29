
import "dotenv/config";

import transporter from "../config/email.js";

async function testEmailConnection() {
  try {
    await transporter.verify();

    console.log("Email SMTP connection successful");
  } catch (error) {
    console.error("Email SMTP connection failed:", error.message);
  }
}

testEmailConnection();