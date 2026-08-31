import { findUserByEmail, findUserById, createUser, findRefreshToken, createRefreshToken, deleteRefreshToken, deleteUserRefreshTokens, findRefreshTokenWithUser, deleteRefreshTokenById, findRoleByName, } from "./auth.repository.js";
import { hashPassword, comparePasswords, } from "../utils/password.js";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, } from "../utils/jwt.js";

// REGISTER

export async function registerUser(data) {
  // Check whether email already exists
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("Email Already Exists");
  }

  // Find default CUSTOMER role
  const customerRole = await findRoleByName("CUSTOMER");

  if (!customerRole) {
    throw new Error("Default CUSTOMER role not found");
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    roleId: customerRole.id,
  });

  // Generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role.name,
  });

  // Generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Refresh token expiry
  const refreshTokenExpiry = new Date();

  refreshTokenExpiry.setDate(
    refreshTokenExpiry.getDate() + 7
  );

  // Store refresh token
  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiry,
  });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
    },

    accessToken,
    refreshToken,
  };
}

// LOGIN

export async function loginUser(email, password) {
  // Find user
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  // Compare password
  const passwordMatches = await comparePasswords(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new Error("Invalid Email or Password");
  }

  // Check account status
  if (!user.isActive) {
    throw new Error("Account inactive");
  }

  // Generate access token
  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role.name,
  });

  // Generate refresh token
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Refresh token expiry
  const refreshTokenExpiry = new Date();

  refreshTokenExpiry.setDate(
    refreshTokenExpiry.getDate() + 7
  );

  // Store refresh token
  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiry,
  });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
    },

    accessToken,
    refreshToken,
  };
}

// REFRESH TOKEN

export async function refreshUserToken(refreshToken) {
  // Find stored refresh token
  const storedToken =
    await findRefreshTokenWithUser(refreshToken);

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // Check database expiry
  if (storedToken.expiresAt < new Date()) {
    await deleteRefreshTokenById(storedToken.id);

    throw new Error("Refresh token expired");
  }

  // Verify JWT refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Make sure token belongs to same user
  if (decoded.userId !== storedToken.userId) {
    throw new Error("Invalid refresh token");
  }

  const user = storedToken.user;

  // Check account status
  if (!user.isActive) {
    throw new Error("User account is inactive");
  }

  // Refresh Token Rotation
  await deleteRefreshTokenById(storedToken.id);

  // Generate new access token
  const newAccessToken = generateAccessToken({
    userId: user.id,
    role: user.role.name,
  });

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken({
    userId: user.id,
  });

  // New refresh token expiry
  const refreshTokenExpiry = new Date();

  refreshTokenExpiry.setDate(
    refreshTokenExpiry.getDate() + 7
  );

  // Store new refresh token
  await createRefreshToken({
    token: newRefreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiry,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

// LOGOUT

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh Token is required");
  }

  await deleteRefreshToken(refreshToken);
}