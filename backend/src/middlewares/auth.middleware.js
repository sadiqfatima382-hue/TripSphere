import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../auth/auth.repository.js";
import prisma from "../config/prisma.js";

export async function authenticate(req, res, next) {
    try {
        // 1. Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication Token is required",
            });
        }

        // 2. Extract token
        const token = authHeader.split(" ")[1];

        // 3. Verify access token
        const decoded = verifyAccessToken(token);

        // 4. Find user and include role
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            include: {
                role: true,
            },
        });

        // 5. Check user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        // 6. Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "User account is inactive",
            });
        }

        // 7. Check role
        if (!user.role) {
            return res.status(401).json({
                success: false,
                message: "User role not found",
            });
        }

        // 8. Attach authenticated user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role.name,
            vendorId: user.vendor?.id ?? null,
        };

        // 9. Continue to next middleware/controller
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
}