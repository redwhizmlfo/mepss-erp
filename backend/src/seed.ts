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

  // Crear Empleado por defecto para vincular al Administrador
  const defaultEmployee = await prisma.employee.upsert({
    where: { dni: "00000000" },
    update: {
      fullName: "Administrador Principal",
      position: "Gerente de Tienda",
      hireDate: new Date("2025-01-01"),
      dailyPay: 150.00,
      active: true
    },
    create: {
      fullName: "Administrador Principal",
      dni: "00000000",
      position: "Gerente de Tienda",
      hireDate: new Date("2025-01-01"),
      dailyPay: 150.00,
      active: true
    }
  });

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, env.BCRYPT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { username: env.ADMIN_USERNAME },
    update: {
      roleId: adminRole.id,
      employeeId: defaultEmployee.id,
      passwordHash,
      active: true
    },
    create: {
      roleId: adminRole.id,
      employeeId: defaultEmployee.id,
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

  console.log(`Admin listo y vinculado a empleado: ${env.ADMIN_USERNAME}`);

  // Sembrar Categorías
  const categoriesToSeed = [
    { name: "Materiales de Construcción", slug: "materiales-construccion" },
    { name: "Herramientas Manuales", slug: "herramientas-manuales" },
    { name: "Pinturas y Acabados", slug: "pinturas-acabados" },
    { name: "Electricidad", slug: "electricidad" },
    { name: "Plomería y Tuberías", slug: "plomeria-tuberias" }
  ];

  const categories = await Promise.all(
    categoriesToSeed.map((cat) =>
      prisma.category.upsert({
        where: { name: cat.name },
        update: { slug: cat.slug },
        create: { name: cat.name, slug: cat.slug }
      })
    )
  );

  const materialsId = categories.find(c => c.name === "Materiales de Construcción")!.id;
  const toolsId = categories.find(c => c.name === "Herramientas Manuales")!.id;
  const paintId = categories.find(c => c.name === "Pinturas y Acabados")!.id;
  const electricityId = categories.find(c => c.name === "Electricidad")!.id;
  const plomeriaId = categories.find(c => c.name === "Plomería y Tuberías")!.id;

  // Sembrar Productos
  const productsToSeed = [
    // Materiales
    { categoryId: materialsId, name: "Cemento Premium Sol Bolsa 42.5kg", slug: "cemento-sol-42-5", brand: "Sol", modelCode: "CEM-425", specs: "Tipo I, 42.5kg", unitName: "Bolsa", stock: 120, reservedQty: 10, minStock: 20, salePrice: 28.50, costPrice: 22.00, iconCode: "Boxes", imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&h=200&fit=crop", description: "Cemento portland tipo I de alta resistencia." },
    { categoryId: materialsId, name: "Fierro Corrugado 1/2 Arequipa", slug: "fierro-corrugado-1-2", brand: "Arequipa", modelCode: "FE-12", specs: "Acero ASTM A615", unitName: "Varilla", stock: 85, reservedQty: 5, minStock: 15, salePrice: 34.00, costPrice: 28.50, iconCode: "Hammer", imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop", description: "Varilla de fierro de construcción sismorresistente." },
    { categoryId: materialsId, name: "Ladrillo de Techo 15x30x30", slug: "ladrillo-techo-15", brand: "Lark", modelCode: "LAD-15", specs: "8 huecos, arcilla cocida", unitName: "Millar", stock: 4, reservedQty: 0, minStock: 1, salePrice: 2400.00, costPrice: 1950.00, iconCode: "Grid", imageUrl: "https://images.unsplash.com/photo-1584344062820-2f3b9052ff37?w=200&h=200&fit=crop", description: "Ladrillo arcilla de 8 huecos para techos ligeros." },
    
    // Herramientas
    { categoryId: toolsId, name: "Martillo de Uña Truper 16oz", slug: "martillo-truper-16", brand: "Truper", modelCode: "TR-16OZ", specs: "Mango fibra vidrio", unitName: "Unidad", stock: 15, reservedQty: 2, minStock: 3, salePrice: 24.50, costPrice: 16.00, iconCode: "Hammer", imageUrl: "https://images.unsplash.com/photo-1540104539488-92a51bbc0410?w=200&h=200&fit=crop", description: "Martillo de acero alto carbono mango de fibra." },
    { categoryId: toolsId, name: "Martillo Goma Wistor", slug: "martillo-goma-wistor", brand: "Wistor", modelCode: "WS-GM", specs: "Goma negra, mango madera", unitName: "Unidad", stock: 10, reservedQty: 0, minStock: 3, salePrice: 18.00, costPrice: 12.00, iconCode: "Hammer", imageUrl: "https://images.unsplash.com/photo-1540104539488-92a51bbc0410?w=200&h=200&fit=crop", description: "Ideal para cerámica y acabados." },
    { categoryId: toolsId, name: "Esmeril Angular Camasa 4.5\"", slug: "esmeril-camasa-4-5", brand: "Camasa", modelCode: "ESM-45", specs: "800W, 11000 RPM", unitName: "Unidad", stock: 8, reservedQty: 1, minStock: 2, salePrice: 120.00, costPrice: 85.00, iconCode: "Disc", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop", description: "Esmeril angular profesional." },
    { categoryId: toolsId, name: "Esmeril Angular Truper 4.5\"", slug: "esmeril-truper-4-5", brand: "Truper", modelCode: "ESM-TR-45", specs: "900W, 12000 RPM", unitName: "Unidad", stock: 12, reservedQty: 3, minStock: 2, salePrice: 145.00, costPrice: 98.00, iconCode: "Disc", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop", description: "Esmeril industrial." },
    { categoryId: toolsId, name: "Cinta Métrica Stanley 5m / 16ft", slug: "cinta-metrica-stanley-5", brand: "Stanley", modelCode: "ST-5M", specs: "5 metros, freno magnético", unitName: "Unidad", stock: 22, reservedQty: 0, minStock: 5, salePrice: 19.90, costPrice: 12.50, iconCode: "Ruler", imageUrl: "https://images.unsplash.com/photo-1540104539488-92a51bbc0410?w=200&h=200&fit=crop", description: "Cinta métrica resistente con freno magnético." },
    
    // Pinturas
    { categoryId: paintId, name: "Pintura Látex Pato Blanco Galón", slug: "latex-pato-blanco", brand: "Pato", modelCode: "PT-BL-GL", specs: "Mate, Acrílico", unitName: "Galón", stock: 18, reservedQty: 4, minStock: 4, salePrice: 42.00, costPrice: 31.00, iconCode: "Paintbrush", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop", description: "Látex acrílico mate de alto rendimiento." },
    { categoryId: paintId, name: "Pintura Esmalte Vencedor Negro Galón", slug: "esmalte-vencedor-negro", brand: "Vencedor", modelCode: "VN-NG-GL", specs: "Brillante, Sintético", unitName: "Galón", stock: 12, reservedQty: 1, minStock: 3, salePrice: 55.00, costPrice: 40.00, iconCode: "Paintbrush", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop", description: "Esmalte sintético." },
    { categoryId: paintId, name: "Brocha Truper Cerda Natural 3 pulgadas", slug: "brocha-truper-3", brand: "Truper", modelCode: "BR-TR-3", specs: "Cerda natural, 3 pulgadas", unitName: "Unidad", stock: 40, reservedQty: 0, minStock: 8, salePrice: 9.50, costPrice: 5.80, iconCode: "Paintbrush", imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop", description: "Brocha para todo tipo de pinturas con mango de madera." },
    
    // Electricidad
    { categoryId: electricityId, name: "Cable Eléctrico Indeco 14 AWG Rojo 100m", slug: "cable-indeco-14-rojo", brand: "Indeco", modelCode: "CBL-14-R", specs: "14 AWG, 100m", unitName: "Rollo", stock: 12, reservedQty: 2, minStock: 3, salePrice: 135.00, costPrice: 105.00, iconCode: "Plug", imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=200&fit=crop", description: "Cable de cobre sólido unipolar para instalaciones internas." },
    { categoryId: electricityId, name: "Interruptor Simple Bticino Modus", slug: "interruptor-simple-bticino", brand: "Bticino", modelCode: "BT-MD-1", specs: "10A, 250V", unitName: "Unidad", stock: 50, reservedQty: 10, minStock: 10, salePrice: 6.80, costPrice: 4.10, iconCode: "Zap", imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=200&fit=crop", description: "Interruptor simple de empotrar color blanco." },

    // Plomeria
    { categoryId: plomeriaId, name: "Tubo PVC Agua Pesada 1/2 pulgada Clase 10", slug: "tubo-pvc-1-2-pesado", brand: "Pavco", modelCode: "PVC-12-P", specs: "Clase 10, 5m", unitName: "Unidad", stock: 65, reservedQty: 5, minStock: 15, salePrice: 11.20, costPrice: 7.80, iconCode: "Wrench", imageUrl: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=200&h=200&fit=crop", description: "Tubo PVC presión para instalaciones de agua potable fría." }
  ];

  await Promise.all(
    productsToSeed.map((p) =>
      prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          categoryId: p.categoryId,
          name: p.name,
          brand: p.brand,
          modelCode: p.modelCode,
          specs: p.specs,
          unitName: p.unitName,
          stock: p.stock,
          reservedQty: p.reservedQty,
          minStock: p.minStock,
          salePrice: p.salePrice,
          costPrice: p.costPrice,
          iconCode: p.iconCode,
          imageUrl: p.imageUrl,
          description: p.description
        },
        create: {
          categoryId: p.categoryId,
          name: p.name,
          slug: p.slug,
          brand: p.brand,
          modelCode: p.modelCode,
          specs: p.specs,
          unitName: p.unitName,
          stock: p.stock,
          reservedQty: p.reservedQty,
          minStock: p.minStock,
          salePrice: p.salePrice,
          costPrice: p.costPrice,
          iconCode: p.iconCode,
          imageUrl: p.imageUrl,
          description: p.description
        }
      })
    )
  );

  console.log(`Categorías y productos sembrados con éxito.`);

  // Sembrar Clientes por defecto
  const defaultCustomers = [
    { documentType: "DNI", documentNumber: "00000000", name: "Cliente Genérico / Venta Rápida", address: "S/D", phone: "S/D", email: "generico@ferremas.com" },
    { documentType: "RUC", documentNumber: "20123456789", name: "Constructora Inka S.A.C.", address: "Av. La Marina 1450, Lima", phone: "987654321", email: "ventas@inkaconstructora.com" }
  ];

  await Promise.all(
    defaultCustomers.map((c) =>
      prisma.customer.upsert({
        where: { documentType_documentNumber: { documentType: c.documentType, documentNumber: c.documentNumber } },
        update: {
          name: c.name,
          address: c.address,
          phone: c.phone,
          email: c.email
        },
        create: {
          documentType: c.documentType,
          documentNumber: c.documentNumber,
          name: c.name,
          address: c.address,
          phone: c.phone,
          email: c.email
        }
      })
    )
  );

  console.log("Clientes sembrados con éxito.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
