import prisma from "../config/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      role: true,
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
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,

      role: {
        connect: {
          id: data.roleId,
        },
      },
    },

    include: {
      role: true,
    },
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

export async function findRefreshTokenWithUser(token) {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });
}

export async function deleteRefreshTokenById(id) {
  return prisma.refreshToken.delete({
    where: {
      id,
    },
  });
}

export async function findRoleByName(name) {
  return prisma.role.findUnique({
    where: {
      name,
    },
  });
}