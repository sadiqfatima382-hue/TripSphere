import prisma from "../src/config/prisma.js";
import { seedServiceCategories } from "./seeders/serviceCategory.seeder.js";
import bcrypt from "bcrypt";

async function main() {
  // =========================================================
  // 1. SEED ROLES
  // =========================================================

  const roles = [
    {
      name: "CUSTOMER",
      description: "Regular TripSphere customer",
    },
    {
      name: "VENDOR",
      description: "TripSphere service provider",
    },
    {
      name: "ADMIN",
      description: "TripSphere platform administrator",
    },
    {
      name: "SUPPORT",
      description: "TripSphere support agent",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        description: role.description,
      },
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");

  // =========================================================
  // 2. SEED PERMISSIONS
  // =========================================================

  const permissions = [
    {
      name: "users.read",
      description: "View users",
    },
    {
      name: "users.create",
      description: "Create users",
    },
    {
      name: "users.update",
      description: "Update users",
    },
    {
      name: "users.delete",
      description: "Delete users",
    },

    {
      name: "vendors.read",
      description: "View vendors",
    },
    {
      name: "vendors.create",
      description: "Create vendors",
    },
    {
      name: "vendors.update",
      description: "Update vendors",
    },
    {
      name: "vendors.approve",
      description: "Approve vendors",
    },

    {
      name: "services.read",
      description: "View services",
    },
    {
      name: "services.create",
      description: "Create services",
    },
    {
      name: "services.update",
      description: "Update services",
    },
    {
      name: "services.delete",
      description: "Delete services",
    },

    {
      name: "bookings.read",
      description: "View bookings",
    },
    {
      name: "bookings.create",
      description: "Create bookings",
    },
    {
      name: "bookings.update",
      description: "Update bookings",
    },
    {
      name: "bookings.cancel",
      description: "Cancel bookings",
    },

    {
      name: "payments.read",
      description: "View payments",
    },
    {
      name: "payments.refund",
      description: "Refund payments",
    },

    {
      name: "reviews.create",
      description: "Create reviews",
    },
    {
      name: "reviews.moderate",
      description: "Moderate reviews",
    },

    {
      name: "payouts.read",
      description: "View payouts",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: {
        description: permission.description,
      },
      create: permission,
    });
  }

  console.log("✅ Permissions seeded successfully");

  // =========================================================
  // 3. DEFINE ROLE PERMISSIONS
  // =========================================================

  const rolePermissions = {
    ADMIN: permissions.map(
      (permission) => permission.name
    ),

    VENDOR: [
      "vendors.read",
      "vendors.create",
      "vendors.update",

      "services.read",
      "services.create",
      "services.update",
      "services.delete",

      "bookings.read",
      "bookings.update",

      "payouts.read",
    ],

    CUSTOMER: [
      "services.read",

      "bookings.read",
      "bookings.create",
      "bookings.update",
      "bookings.cancel",

      "payments.read",

      "reviews.create",
    ],

    SUPPORT: [
      "users.read",
      "vendors.read",
      "services.read",
      "bookings.read",
      "bookings.update",
      "payments.read",
    ],
  };

  // =========================================================
  // 4. CONNECT ROLES WITH PERMISSIONS
  // =========================================================

  for (const [roleName, permissionNames] of Object.entries(
    rolePermissions
  )) {
    const role = await prisma.role.findUnique({
      where: {
        name: roleName,
      },
    });

    if (!role) {
      throw new Error(
        `Role ${roleName} not found`
      );
    }

    for (const permissionName of permissionNames) {
      const permission =
        await prisma.permission.findUnique({
          where: {
            name: permissionName,
          },
        });

      if (!permission) {
        throw new Error(
          `Permission ${permissionName} not found`
        );
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log(
    "✅ Role permissions seeded successfully"
  );

  // =========================================================
  // 5. SEED VENDOR USER
  // =========================================================

  const vendorRole = await prisma.role.findUnique({
    where: {
      name: "VENDOR",
    },
  });

  if (!vendorRole) {
    throw new Error(
      "VENDOR role not found"
    );
  }

  const hashedPassword = await bcrypt.hash(
    "Vendor123",
    12
  );

  await prisma.user.upsert({
    where: {
      email: "vendor@tripsphere.com",
    },
    update: {
      roleId: vendorRole.id,
      isActive: true,
    },
    create: {
      firstName: "TripSphere",
      lastName: "Vendor",
      email: "vendor@tripsphere.com",
      password: hashedPassword,
      roleId: vendorRole.id,
      isActive: true,
    },
  });

  console.log(
    "✅ Vendor user seeded successfully"
  );

  // =========================================================
  // 6. SEED ADMIN USER
  // =========================================================

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error(
      "ADMIN role not found"
    );
  }

  const adminHashedPassword =
    await bcrypt.hash("Admin123", 12);

  await prisma.user.upsert({
    where: {
      email: "admin@tripsphere.com",
    },
    update: {
      roleId: adminRole.id,
      isActive: true,
    },
    create: {
      firstName: "TripSphere",
      lastName: "Admin",
      email: "admin@tripsphere.com",
      password: adminHashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log(
    "✅ Admin user seeded successfully"
  );

  // =========================================================
  // 7. SEED SERVICE CATEGORIES
  // =========================================================

  await seedServiceCategories();

}

// =========================================================
// RUN SEED
// =========================================================

main()
  .catch((error) => {
    console.error(
      "❌ Seed failed:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });