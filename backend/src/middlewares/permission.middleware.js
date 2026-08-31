import prisma from "../config/prisma.js";

export function authorizePermission(permissionName) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const role = await prisma.role.findUnique({
        where: {
          name: req.user.role,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      if (!role) {
        return res.status(403).json({
          success: false,
          message: "Role not found",
        });
      }

      const hasPermission = role.permissions.some(
        (rolePermission) =>
          rolePermission.permission.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to verify permission",
      });
    }
  };
}