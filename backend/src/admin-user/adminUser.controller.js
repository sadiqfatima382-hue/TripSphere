import { getAllUsersService, getUserByIdService, updateUserStatusService, updateUserRoleService, getUserBookingHistoryService } from "./adminUser.service.js";

export async function getAllUsersController(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const { search, role } = req.query;

    let isActive;

    if (req.query.isActive !== undefined) {
      if (!["true", "false"].includes(req.query.isActive)) {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      isActive = req.query.isActive === "true";
    }

    const result = await getAllUsersService({
      page,
      limit,
      search,
      role,
      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getUserByIdController(req, res, next) {
  try {
    const user = await getUserByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function updateUserStatusController(req, res, next) {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const user = await updateUserStatusService(
      req.params.id,
      isActive,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function updateUserRoleController(req, res, next) {
  try {
    const { role } = req.body;

    if (typeof role !== "string" || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid role is required",
      });
    }

    const user = await updateUserRoleService(
      req.params.id,
      role.trim().toUpperCase(),
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getUserBookingHistoryController(
  req,
  res,
  next
) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await getUserBookingHistoryService(
      req.params.id,
      { page, limit }
    );

    return res.status(200).json({
      success: true,
      message: "User booking history fetched successfully",
      data: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

