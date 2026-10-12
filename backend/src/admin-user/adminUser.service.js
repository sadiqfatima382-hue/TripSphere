import {  findAllUsers,  findUserById, updateUserStatus, countActiveAdmins,findRoleByName,updateUserRole} from "./adminUser.repository.js";

const allowedRoles = ["CUSTOMER", "VENDOR", "ADMIN", "SUPPORT"];

export async function getAllUsersService({
  page = 1,
  limit = 10,
  search,
  role,
  isActive,
} = {}) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Limit must be an integer between 1 and 100");
  }

  if (role && !allowedRoles.includes(role)) {
    throw new Error("Invalid user role");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new Error("isActive must be a boolean");
  }

  const skip = (page - 1) * limit;

  const { users, total } = await findAllUsers({
    skip,
    take: limit,
    search: search?.trim(),
    role,
    isActive,
  });

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getUserByIdService(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUserStatusService(
  userId,
  isActive,
  adminId
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be a boolean");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isActive === isActive) {
    throw new Error(
      `User account is already ${isActive ? "active" : "inactive"}`
    );
  }

  if (!isActive && userId === adminId) {
    throw new Error("You cannot deactivate your own account");
  }

  if (!isActive && user.role.name === "ADMIN") {
    const activeAdminCount = await countActiveAdmins();

    if (activeAdminCount <= 1) {
      throw new Error(
        "Cannot deactivate the last active administrator"
      );
    }
  }

  return updateUserStatus(userId, isActive);
}

export async function updateUserRoleService(
  userId,
  roleName,
  adminId
) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!allowedRoles.includes(roleName)) {
    throw new Error("Invalid user role");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role.name === roleName) {
    throw new Error("User already has this role");
  }

  if (userId === adminId) {
    throw new Error("You cannot change your own role");
  }

  if (user.isActive && user.role.name === "ADMIN") {
    const activeAdminCount = await countActiveAdmins();

    if (activeAdminCount <= 1) {
      throw new Error(
        "Cannot change the role of the last active administrator"
      );
    }
  }

  const role = await findRoleByName(roleName);

  if (!role) {
    throw new Error("Role not found");
  }

  return updateUserRole(userId, role.id);
}

