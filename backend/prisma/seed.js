import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

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
}


// =========================================================
// RUN SEED
// =========================================================

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

