import { Router } from "express";
import { prisma } from "../../shared/prisma.js";
import { asyncHandler } from "../../shared/async-handler.js";

export const inventoryRouter = Router();

inventoryRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const q = req.query.q as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;

    const where: any = { active: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { name: "asc" }
    });

    res.json(products);
  })
);

// Get all categories
inventoryRouter.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { name: "asc" }
    });
    res.json(categories);
  })
);

// Create a new product (and category on the fly if needed)
inventoryRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const data = req.body;
    
    // Slugify helper
    const generateSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 1. Find or create the category
    const categoryName = (data.categoryName || "General").trim();
    const categorySlug = generateSlug(categoryName);
    
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        slug: categorySlug
      }
    });

    // 2. Create the product
    const productName = data.name.trim();
    let productSlug = generateSlug(productName);
    
    // Ensure slug is unique
    const existing = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (existing) {
      productSlug = `${productSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        categoryId: category.id,
        name: productName,
        slug: productSlug,
        brand: data.brand || null,
        modelCode: data.modelCode || null,
        specs: data.specs || null,
        unitName: data.unitName || "Unidad",
        stock: data.stock || 0,
        reservedQty: data.reservedQty || 0,
        minStock: data.minStock || 0,
        salePrice: data.salePrice || 0,
        costPrice: data.costPrice || 0,
        iconCode: data.iconCode || null,
        imageUrl: data.imageUrl || null,
        description: data.description || null
      },
      include: {
        category: true
      }
    });

    res.status(201).json(product);
  })
);
