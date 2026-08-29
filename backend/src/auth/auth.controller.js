import { registerSchema, loginSchema, } from "../validators/auth/auth.validation.js";
import { registerUser, loginUser, refreshUserToken, logoutUser } from "../auth/auth.service.js";

export async function register(req, res) {
    try {
        const validatedData = registerSchema.parse(req.body);

        const result = await registerUser(validatedData);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const validatedData = loginSchema.parse(req.body);

        const result = await loginUser(
            validatedData.email,
            validatedData.password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await refreshUserToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    await logoutUser(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}