import { findUserByEmail, findUserById, createUser, findRefreshToken, createRefreshToken, deleteRefreshToken, deleteUserRefreshTokens } from "./auth.repository.js";
import { hashPassword, comparePasswords } from "../utils/password.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
import env from "../config/env.js";

export async function registerUser(data) {
    const existingUser = await findUserByEmail(data.email);

    if (existingUser) {
        throw new Error("Email Already Exists")
    }

const hashedPassword = await hashPassword(data.password);

const user = await createUser({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
});

const accessToken = await generateAccessToken({
    userId: user.id,
    role: user.role,
});

const refreshToken = await generateRefreshToken({
    userId: user.id,
})

const refreshTokenExpiry = new Date()

refreshTokenExpiry.setDate(
    refreshTokenExpiry.getDate() + 7
)

await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiry
})


return {
    user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    },
    accessToken,
    refreshToken,
};
 };

export async function loginUser(email, password) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid Email or Password")
    }

const passwordMatches = await comparePasswords(
    password,
    user.password
)

if (!passwordMatches) {
    throw new Error("Invalid Email or Password")
}

if (!user.isActive) {
    throw new Error("Account inactive")
}

 const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  const refreshTokenExpiry = new Date();

  refreshTokenExpiry.setDate(
    refreshTokenExpiry.getDate() + 7
  );

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
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

