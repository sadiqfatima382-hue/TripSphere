import prisma from "../config/prisma.js";

export async function connectDatabase() {
  try {
    await prisma.$connect();

    console.log("✅ PostgreSQL database connected");
  } catch (error) {
    console.error("❌ PostgreSQL database connection failed");
    console.error(error);

    process.exit(1);
  }
}