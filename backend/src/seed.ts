import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { prisma } from "./shared/prisma.js";

const modules = [
  "dashboard",
  "ventas",
  "inventario",
  "proveedores",
  "pedidos_proveedor",
  "clientes",
  "empleados",
  "asistencias",
  "salarios",
  "boletas_pago",
  "perdidas",
  "reportes",
  "usuarios",
  "roles",
  "permisos",
  "configuracion",
  "auditoria"
];

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { code: "admin" },
    update: { name: "Administrador" },
    create: { code: "admin", name: "Administrador" }
  });

  await prisma.role.upsert({
    where: { code: "empleado" },
    update: { name: "Empleado" },
    create: { code: "empleado", name: "Empleado" }
  });

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  const adminUser = await prisma.user.upsert({
    where: { username: env.ADMIN_USERNAME },
    update: {
      roleId: adminRole.id,
      passwordHash,
      active: true
    },
    create: {
      roleId: adminRole.id,
      username: env.ADMIN_USERNAME,
      passwordHash,
      active: true
    }
  });

  await Promise.all(
    modules.map((moduleKey) =>
      prisma.userPermission.upsert({
        where: {
          userId_moduleKey: {
            userId: adminUser.id,
            moduleKey
          }
        },
        update: {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        },
        create: {
          userId: adminUser.id,
          moduleKey,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        }
      })
    )
  );

  console.log(`Admin listo: ${env.ADMIN_USERNAME}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
