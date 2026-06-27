"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Boxes, Plus, Search, X } from "lucide-react";
import { listProducts, Product } from "@/lib/api";
import { ProductFormModal } from "./ProductFormModal";

type BrandGroup = {
  brandName: string;
  models: Product[];
  totalInvested: number;
};

type CategoryGroup = {
  categoryName: string;
  brands: Record<string, BrandGroup>;
};

const stopwords = new Set([
  "de", "del", "la", "el", "las", "los", "un", "una", "con", "para", "por", "y", "o", "en", "al",
  "que", "sea", "quiero", "necesito", "buscar", "producto", "productos"
]);

const aliases: Record<string, string[]> = {
  rojo: ["roja", "red"],
  roja: ["rojo", "red"],
  blanco: ["blanca", "white"],
  blanca: ["blanco", "white"],
  negro: ["negra", "black"],
  negra: ["negro", "black"],
  galon: ["gal", "gl", "3.785", "3785", "litro", "litros"],
  galones: ["galon", "gal", "gl", "litros"],
  litro: ["litros", "l"],
  litros: ["litro", "l"],
  pulgada: ["pulg", "pulgadas"],
  pulgadas: ["pulg", "pulgada"],
  cemento: ["bolsa", "construccion"],
  pintura: ["latex", "esmalte", "pato", "vencedor"],
  cable: ["electrico", "electricidad", "indeco"],
  interruptor: ["switch", "bticino"],
  fierro: ["barra", "corrugada", "acero"],
  varilla: ["barra", "fierro", "corrugada"],
  martillo: ["combo", "golpe", "una"],
  tubo: ["pvc", "plomeria", "agua"]
};

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getSearchTerms(query: string) {
  return Array.from(new Set(
    normalizeText(query)
      .split(/[^a-z0-9.]+/)
      .filter((term) => term.length > 0 && !stopwords.has(term))
  ));
}

function productSearchText(product: Product) {
  return normalizeText([
    product.name,
    product.brand,
    product.modelCode,
    product.specs,
    product.unitName,
    product.description,
    product.category?.name,
    product.slug
  ].filter(Boolean).join(" "));
}

function scoreProduct(product: Product, terms: string[]) {
  const text = productSearchText(product);

  return terms.reduce((score, term) => {
    const variants = [term, ...(aliases[term] ?? [])];
    return score + (variants.some((variant) => text.includes(normalizeText(variant))) ? 1 : 0);
  }, 0);
}

function groupProducts(products: Product[]) {
  const grouped: Record<string, CategoryGroup> = {};

  products.forEach((p) => {
    const catName = p.category?.name || "Sin categoria";
    const brandName = p.brand || "Sin marca";

    if (!grouped[catName]) {
      grouped[catName] = { categoryName: catName, brands: {} };
    }

    if (!grouped[catName].brands[brandName]) {
      grouped[catName].brands[brandName] = {
        brandName,
        models: [],
        totalInvested: 0
      };
    }

    const stockNum = typeof p.stock === "string" ? parseFloat(p.stock) : p.stock;
    const costNum = typeof p.costPrice === "string" ? parseFloat(p.costPrice) : p.costPrice;
    const stock = isNaN(stockNum) ? 0 : stockNum;
    const costPrice = isNaN(costNum) ? 0 : costNum;

    grouped[catName].brands[brandName].models.push({
      ...p,
      stock,
      costPrice
    });
    grouped[catName].brands[brandName].totalInvested += stock * costPrice;
  });

  return grouped;
}

export function InventoryClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await listProducts(token);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setLoading(false);
    }
  };

  const searchTerms = useMemo(() => getSearchTerms(searchQuery), [searchQuery]);

  const filteredProducts = useMemo(() => {
    if (searchTerms.length === 0) {
      return products;
    }

    return products
      .map((product) => ({ product, score: scoreProduct(product, searchTerms) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.product.name.localeCompare(b.product.name);
      })
      .map((result) => result.product);
  }, [products, searchTerms]);

  const categories = useMemo(() => groupProducts(filteredProducts), [filteredProducts]);
  const categoryEntries = Object.values(categories);
  const isSearching = searchTerms.length > 0;

  const toggleCategory = (catName: string) => {
    setOpenCategories((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  const toggleBrand = (brandKey: string) => {
    setOpenBrands((prev) => ({ ...prev, [brandKey]: !prev[brandKey] }));
  };

  if (loading) {
    return (
      <div className="inventoryLayout">
        <div className="posLoading">Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="inventoryLayout">
      <header className="inventoryHeader">
        <div className="headerLeft">
          <h1>Inventario de Productos</h1>
          <p>Clasificacion por categoria y marca</p>
        </div>
        <div className="headerRight">
          <button className="btnNewProduct" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </header>

      <div className="inventorySearchBar">
        <Search size={18} />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Busca como hablas: pintura blanca galon, cable rojo 14, tubo pvc 1/2..."
        />
        {searchQuery ? (
          <button type="button" onClick={() => setSearchQuery("")} aria-label="Limpiar busqueda">
            <X size={16} />
          </button>
        ) : null}
      </div>

      {categoryEntries.length === 0 ? (
        <div className="inventoryEmpty">
          <Boxes size={48} />
          <p>{isSearching ? "No se encontraron productos para esa busqueda." : "No hay productos en el inventario."}</p>
        </div>
      ) : (
        categoryEntries.map((cat) => {
          const isCatOpen = isSearching || openCategories[cat.categoryName];
          return (
            <div key={cat.categoryName} className={`accCategory ${isCatOpen ? "open" : ""}`}>
              <div className="accCategoryHeader" onClick={() => toggleCategory(cat.categoryName)}>
                <div className="accCategoryTitle">
                  <div className="accCategoryIcon">
                    <Boxes size={20} />
                  </div>
                  <div>
                    <h2>{cat.categoryName}</h2>
                  </div>
                  <span>{Object.keys(cat.brands).length} Marcas</span>
                </div>
                <ChevronDown size={20} className="accIcon" />
              </div>

              <div className="accContentWrapper">
                <div className="accContentInner">
                  <div className="accContent">
                    {Object.values(cat.brands).map((brand) => {
                      const brandKey = `${cat.categoryName}-${brand.brandName}`;
                      const isBrandOpen = isSearching || openBrands[brandKey];
                      return (
                        <div key={brandKey} className={`accBrand ${isBrandOpen ? "open" : ""}`}>
                          <div className="accBrandHeader" onClick={() => toggleBrand(brandKey)}>
                            <div className="accBrandInfo">
                              <h3>
                                <ChevronRight size={16} className="brandIcon" />
                                {brand.brandName}
                              </h3>
                            </div>
                            <div className="brandStats">
                              <div className="brandStat">
                                <span className="brandStatLabel">Modelos</span>
                                <span className="brandStatValue valItems">{brand.models.length}</span>
                              </div>
                              <div className="brandStat">
                                <span className="brandStatLabel">Inv. Total</span>
                                <span className="brandStatValue valTotal">
                                  S/ {brand.totalInvested.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="brandContentWrapper">
                            <div className="brandContentInner">
                              <div className="brandContent">
                                <div className="modelsTableWrapper">
                                  <table className="modelsTable">
                                    <thead>
                                      <tr>
                                        <th style={{ width: "60px" }}>Imagen</th>
                                        <th>Producto / Modelo</th>
                                        <th>Codigo</th>
                                        <th>Especificaciones</th>
                                        <th className="rightAlign">Precio Unit. (S/)</th>
                                        <th className="rightAlign">Stock</th>
                                        <th className="rightAlign">Reserva</th>
                                        <th className="rightAlign">Total Stock (S/)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {brand.models.map((model) => {
                                        const totalStockValue = model.stock * model.costPrice;
                                        const reservedQtyNum = typeof model.reservedQty === "string" ? parseFloat(model.reservedQty) : model.reservedQty;
                                        const reservedQty = isNaN(reservedQtyNum) ? 0 : reservedQtyNum;

                                        return (
                                          <tr key={model.id}>
                                            <td className="modelImgCol">
                                              {model.imageUrl ? (
                                                <img src={model.imageUrl} alt={model.name} className="modelImage" loading="lazy" />
                                              ) : (
                                                <div className="modelImagePlaceholder">
                                                  <span className="brandMark" style={{ fontSize: "12px", padding: "6px" }}>{brand.brandName.substring(0, 1)}</span>
                                                </div>
                                              )}
                                            </td>
                                            <td className="modelNameCol">{model.name}</td>
                                            <td>
                                              {model.modelCode ? (
                                                <span className="modelCodeCol">{model.modelCode}</span>
                                              ) : (
                                                <span style={{ color: "var(--muted)" }}>-</span>
                                              )}
                                            </td>
                                            <td>
                                              <div className="modelSpecsCol" title={model.specs || ""}>
                                                {model.specs || "-"}
                                              </div>
                                            </td>
                                            <td className="rightAlign modelMoneyCol" style={{ color: "var(--clr-on-surface)" }}>
                                              {model.salePrice.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="rightAlign">
                                              <span className={`modelStockCol ${model.stock <= model.minStock ? "low" : ""}`}>
                                                {model.stock} {model.unitName}
                                              </span>
                                            </td>
                                            <td className="rightAlign modelNumberCol">
                                              {reservedQty > 0 ? reservedQty : "-"}
                                            </td>
                                            <td className="rightAlign modelMoneyCol">
                                              {totalStockValue.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {isFormOpen && (
        <ProductFormModal
          token={token}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false);
            loadInventory();
          }}
        />
      )}
    </div>
  );
}
