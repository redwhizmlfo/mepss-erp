import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createProduct, listCategories, Category } from "@/lib/api";

type ProductFormModalProps = {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function ProductFormModal({ token, onClose, onSuccess }: ProductFormModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryName: "",
    brand: "",
    modelCode: "",
    specs: "",
    unitName: "Unidad",
    stock: "0",
    minStock: "0",
    salePrice: "0",
    costPrice: "0",
    imageUrl: "",
    description: ""
  });

  useEffect(() => {
    // Load existing categories for the datalist
    listCategories(token).then(setCategories).catch(console.error);
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        stock: parseFloat(formData.stock) || 0,
        minStock: parseFloat(formData.minStock) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
      };
      
      await createProduct(token, payload);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formOverlay">
      <div className="formContainer">
        <div className="formHeader">
          <h2>Añadir Nuevo Producto</h2>
          <button className="closeButton" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="formBody">
            {/* Sección Clasificación */}
            <div className="formGrid">
              <div className="formGroup colSpan2">
                <label>Nombre del Producto *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="formInput" 
                  placeholder="Ej: Esmeril Angular 4.5 pulgadas" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Categoría *</label>
                <input 
                  type="text" 
                  name="categoryName" 
                  className="formInput" 
                  list="category-list"
                  placeholder="Selecciona o escribe una nueva" 
                  required 
                  value={formData.categoryName} 
                  onChange={handleChange} 
                />
                <datalist id="category-list">
                  {categories.map(c => <option key={c.id} value={c.name} />)}
                </datalist>
              </div>

              <div className="formGroup">
                <label>Marca</label>
                <input 
                  type="text" 
                  name="brand" 
                  className="formInput" 
                  placeholder="Ej: Truper, Dewalt..." 
                  value={formData.brand} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Código de Modelo</label>
                <input 
                  type="text" 
                  name="modelCode" 
                  className="formInput" 
                  placeholder="Ej: ESM-TR-45" 
                  value={formData.modelCode} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Especificaciones Breves</label>
                <input 
                  type="text" 
                  name="specs" 
                  className="formInput" 
                  placeholder="Ej: 900W, 12000 RPM" 
                  value={formData.specs} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Sección Precios e Inventario */}
            <div className="formGrid">
              <div className="formGroup">
                <label>Precio de Venta (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="salePrice" 
                  className="formInput" 
                  required 
                  value={formData.salePrice} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Costo de Compra (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="costPrice" 
                  className="formInput" 
                  required 
                  value={formData.costPrice} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Stock Inicial</label>
                <input 
                  type="number" 
                  name="stock" 
                  className="formInput" 
                  required 
                  value={formData.stock} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Stock Mínimo (Alerta)</label>
                <input 
                  type="number" 
                  name="minStock" 
                  className="formInput" 
                  required 
                  value={formData.minStock} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>Unidad de Medida</label>
                <input 
                  type="text" 
                  name="unitName" 
                  className="formInput" 
                  placeholder="Ej: Unidad, Galón, Metro..." 
                  required 
                  value={formData.unitName} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup">
                <label>URL de Imagen (Opcional)</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  className="formInput" 
                  placeholder="https://..." 
                  value={formData.imageUrl} 
                  onChange={handleChange} 
                />
              </div>

              <div className="formGroup colSpan2">
                <label>Descripción detallada</label>
                <textarea 
                  name="description" 
                  className="formInput" 
                  placeholder="Detalles adicionales del producto..." 
                  value={formData.description} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="formFooter">
            <button type="button" className="btnSecondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btnPrimary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
