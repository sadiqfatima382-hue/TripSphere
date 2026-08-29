import prisma from "../config/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

export async function createRefreshToken(data) {
  return prisma.refreshToken.create({
    data,
  });
}

export async function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
}

export async function deleteRefreshToken(token) {
  return prisma.refreshToken.delete({
    where: {
      token,
    },
  });
}

export async function deleteUserRefreshTokens(userId) {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
}