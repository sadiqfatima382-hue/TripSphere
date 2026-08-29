import express from "express";
import { register, login, refreshToken,logout} from "../auth/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
//Protected route
router.get("/me", authenticate, async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authenticated user",
        data: {
            user: req.user,
        },
    });
});

export default router;