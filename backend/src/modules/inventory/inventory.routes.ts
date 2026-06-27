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
    let terms: string[] = [];

    if (q) {
      const stopwords = new Set(["de", "del", "la", "el", "las", "los", "un", "una", "con", "para", "por", "y", "o", "en", "al"]);
      terms = Array.from(new Set(
        q.trim().split(/\s+/).map(t => t.toLowerCase()).filter(t => t.length > 0 && !stopwords.has(t))
      ));
      
      if (terms.length > 0) {
        // Find products that match AT LEAST ONE of the search terms
        where.OR = terms.map(term => ({
          OR: [
            { name: { contains: term, mode: "insensitive" } },
            { description: { contains: term, mode: "insensitive" } },
            { brand: { contains: term, mode: "insensitive" } },
            { modelCode: { contains: term, mode: "insensitive" } },
            { specs: { contains: term, mode: "insensitive" } },
            { unitName: { contains: term, mode: "insensitive" } },
            { category: { name: { contains: term, mode: "insensitive" } } }
          ]
        }));
      }
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      }
    });

    let results = products;
    if (terms.length > 0) {
      // Score each product based on how many terms match its text
      const scoredProducts = products.map(p => {
        let score = 0;
        const searchableText = [
          p.name, p.description, p.brand, p.modelCode, p.specs, p.unitName, p.category?.name
        ].filter(Boolean).join(" ").toLowerCase();

        for (const term of terms) {
          if (searchableText.includes(term)) {
            score++;
          }
        }
        return { product: p, score };
      });

      // Sort by score descending, then by name ascending
      scoredProducts.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.product.name.localeCompare(b.product.name);
      });

      results = scoredProducts.map(sp => sp.product);
    } else {
      // Default sort by name
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json(results);
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
