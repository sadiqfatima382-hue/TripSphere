import dotenv from "dotenv"

dotenv.config();
const requiredEnvVariables=[
    "Database_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
]

for(const variable of requiredEnvVariables){
    if (!process.env[variable]) {
        throw new Error (`Mising Required Environmental Variables: ${variable} `)
    }
}

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES:process.env.JWT_ACCESS_EXPIRES||"20m",
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES||"7d",
    BCRYPT_SALT_ROUNDS:Number(process.env.BCRYPT_SALT_ROUNDS)||12
}
export default env;
