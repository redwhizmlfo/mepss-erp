"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Boxes, Plus } from "lucide-react";
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

export function InventoryClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Record<string, CategoryGroup>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const products = await listProducts(token);
      
      const grouped: Record<string, CategoryGroup> = {};

      products.forEach((p) => {
        const catName = p.category?.name || "Sin categoría";
        const brandName = p.brand || "Sin marca";

        if (!grouped[catName]) {
          grouped[catName] = { categoryName: catName, brands: {} };
        }

        if (!grouped[catName].brands[brandName]) {
          grouped[catName].brands[brandName] = {
            brandName,
            models: [],
            totalInvested: 0,
          };
        }

        const stockNum = typeof p.stock === 'string' ? parseFloat(p.stock) : p.stock;
        const costNum = typeof p.costPrice === 'string' ? parseFloat(p.costPrice) : p.costPrice;
        
        const stock = isNaN(stockNum) ? 0 : stockNum;
        const costPrice = isNaN(costNum) ? 0 : costNum;

        const invested = stock * costPrice;
        
        // Fix string/number mapping if needed
        const modelToStore = {
            ...p,
            stock,
            costPrice
        };

        grouped[catName].brands[brandName].models.push(modelToStore);
        grouped[catName].brands[brandName].totalInvested += invested;
      });

      setCategories(grouped);
      setLoading(false);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setLoading(false);
    }
  };

  const toggleCategory = (catName: string) => {
    setOpenCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const toggleBrand = (brandKey: string) => {
    setOpenBrands(prev => ({ ...prev, [brandKey]: !prev[brandKey] }));
  };

  if (loading) {
    return (
      <div className="inventoryLayout">
        <div className="posLoading">Cargando inventario...</div>
      </div>
    );
  }

  const categoryEntries = Object.values(categories);

  return (
    <div className="inventoryLayout">
      <header className="inventoryHeader">
        <div className="headerLeft">
          <h1>Inventario de Productos</h1>
          <p>Clasificación por Categoría y Marca</p>
        </div>
        <div className="headerRight">
          <button className="btnNewProduct" onClick={() => setIsFormOpen(true)}>
            <Plus size={18} />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </header>

      {categoryEntries.length === 0 ? (
        <div className="inventoryEmpty">
          <Boxes size={48} />
          <p>No hay productos en el inventario.</p>
        </div>
      ) : (
        categoryEntries.map((cat) => {
          const isCatOpen = openCategories[cat.categoryName];
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
                      const isBrandOpen = openBrands[brandKey];
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
                                  S/ {brand.totalInvested.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                        <th style={{ width: '60px' }}>Imagen</th>
                                        <th>Producto / Modelo</th>
                                        <th>Código</th>
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
                                        const reservedQtyNum = typeof model.reservedQty === 'string' ? parseFloat(model.reservedQty) : model.reservedQty;
                                        const reservedQty = isNaN(reservedQtyNum) ? 0 : reservedQtyNum;

                                        return (
                                          <tr key={model.id}>
                                            <td className="modelImgCol">
                                              {model.imageUrl ? (
                                                <img src={model.imageUrl} alt={model.name} className="modelImage" loading="lazy" />
                                              ) : (
                                                <div className="modelImagePlaceholder">
                                                  <span className="brandMark" style={{fontSize: '12px', padding: '6px'}}>{brand.brandName.substring(0, 1)}</span>
                                                </div>
                                              )}
                                            </td>
                                            <td className="modelNameCol">{model.name}</td>
                                            <td>
                                              {model.modelCode ? (
                                                <span className="modelCodeCol">{model.modelCode}</span>
                                              ) : (
                                                <span style={{color: 'var(--muted)'}}>-</span>
                                              )}
                                            </td>
                                            <td>
                                              <div className="modelSpecsCol" title={model.specs || ""}>
                                                {model.specs || "-"}
                                              </div>
                                            </td>
                                            <td className="rightAlign modelMoneyCol" style={{color: 'var(--clr-on-surface)'}}>
                                              {model.salePrice.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="rightAlign">
                                              <span className={`modelStockCol ${model.stock <= model.minStock ? 'low' : ''}`}>
                                                {model.stock} {model.unitName}
                                              </span>
                                            </td>
                                            <td className="rightAlign modelNumberCol">
                                              {reservedQty > 0 ? reservedQty : "-"}
                                            </td>
                                            <td className="rightAlign modelMoneyCol">
                                              {totalStockValue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
