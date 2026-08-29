import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../auth/auth.repository.js";
import { success } from "zod";

export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Authentication Token is required"
            })
        }

        const token = authHeader.split(" ")[1];
        const decode = verifyAccessToken(token);
        const user = await findUserById(decode.userId)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "User account is inactive",
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
}