"use client";

import {
  Boxes,
  CheckCircle2,
  Hammer,
  Loader2,
  Minus,
  Package,
  Paintbrush,
  Plus,
  Plug,
  Ruler,
  Search,
  ShoppingCart,
  Trash2,
  Wrench,
  X,
  Zap
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Category,
  type Customer,
  type PaymentMethod,
  type Product,
  type SaleResult,
  type VoucherType,
  createSale
} from "@/lib/api";

// ─── Icon Map ───────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Boxes,
  Hammer,
  Paintbrush,
  Plug,
  Ruler,
  Wrench,
  Zap,
  Grid: Boxes,
  Package
};

function ProductIcon({ code }: { code: string | null }) {
  const Icon = (code && ICON_MAP[code]) ? ICON_MAP[code] : Package;
  return <Icon size={20} />;
}

// ─── Cart Item ───────────────────────────────────────────────────────────────
type CartLine = {
  product: Product;
  quantity: number;
};

// ─── Props ───────────────────────────────────────────────────────────────────
type Props = {
  token: string;
  products: Product[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
  voucherTypes: VoucherType[];
  customers: Customer[];
};

function fmt(n: number) {
  return `S/ ${n.toFixed(2)}`;
}

export function SalesPosView({
  token,
  products,
  categories,
  paymentMethods,
  voucherTypes,
  customers
}: Props) {
  // ─── Filtros ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // ─── Carrito ─────────────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ─── Configuración de venta ──────────────────────────────────────────────
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id ?? "");
  const [voucherTypeId, setVoucherTypeId] = useState(voucherTypes[0]?.id ?? "");
  const [clientId, setClientId] = useState<string>("");

  // ─── Modal checkout ──────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saleResult, setSaleResult] = useState<SaleResult | null>(null);
  const [saleError, setSaleError] = useState<string | null>(null);

  // ─── Productos filtrados ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === "all" || p.category.id === activeCategory;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  // ─── Totales ─────────────────────────────────────────────────────────────
  const subtotal = cart.reduce((s, l) => s + l.quantity * Number(l.product.salePrice), 0);
  const total = subtotal; // sin descuento inicial
  const received = parseFloat(amountReceived) || 0;
  const change = received >= total ? received - total : null;
  const cartCount = cart.reduce((s, l) => s + l.quantity, 0);

  // ─── Helpers carrito ─────────────────────────────────────────────────────
  function addToCart(product: Product) {
    if (Number(product.stock) <= 0) return;
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock)) return prev;
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          l.product.id === productId ? { ...l, quantity: l.quantity + delta } : l
        )
        .filter((l) => l.quantity > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((l) => l.product.id !== productId));
  }

  function clearCart() {
    setCart([]);
    setSaleResult(null);
    setSaleError(null);
  }

  // ─── Checkout ─────────────────────────────────────────────────────────────
  async function handleConfirmSale() {
    setSaleError(null);
    if (!paymentMethodId || !voucherTypeId) {
      setSaleError("Selecciona método de pago y tipo de comprobante.");
      return;
    }
    if (received < total) {
      setSaleError("El monto recibido debe ser mayor o igual al total.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createSale(token, {
        clientId: clientId || null,
        paymentMethodId,
        voucherTypeId,
        amountReceived: received,
        items: cart.map((l) => ({ productId: l.product.id, quantity: l.quantity }))
      });
      setSaleResult(result);
    } catch (err) {
      setSaleError(err instanceof Error ? err.message : "Error al registrar la venta.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNewSale() {
    clearCart();
    setShowModal(false);
    setAmountReceived("");
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="pos">
      {/* ── LEFT: Products ─────────────────────────────────────────────────── */}
      <div className="posProducts">
        <div className="posHeader">
          <div>
            <p className="eyebrow">Módulo operativo</p>
            <h1>Punto de Venta</h1>
          </div>
          <div className="posSearch">
            <Search size={16} />
            <input
              id="pos-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
            />
            {search && (
              <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} onClick={() => setSearch("")}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="categoryTabs">
          <button
            id="cat-all"
            className={`catTab${activeCategory === "all" ? " active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`cat-${cat.slug}`}
              className={`catTab${activeCategory === cat.id ? " active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="productGrid">
          {filtered.length === 0 ? (
            <div className="posEmpty">
              <Package size={48} />
              <p>No se encontraron productos.</p>
            </div>
          ) : (
            filtered.map((product) => {
              const isOut = Number(product.stock) <= 0;
              const isLow = !isOut && Number(product.stock) <= Number(product.minStock);
              return (
                <div
                  key={product.id}
                  className={`productCard${isOut ? " outOfStock" : ""}`}
                  onClick={() => addToCart(product)}
                  title={isOut ? "Sin stock" : `Añadir ${product.name}`}
                >
                  <img 
                    src={product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=1e2020&color=FFB800&size=400&font-size=0.33`} 
                    alt={product.name}
                    className="productCardImage"
                  />
                  
                  <div className="productCardOverlay">
                    <div className="overlayTop">
                      <span className="overlayPrice">{fmt(Number(product.salePrice))}</span>
                      <span className={`overlayStock${isLow ? " low" : ""}`}>
                        {isOut ? "Agotado" : `${Number(product.stock)} ${product.unitName}`}
                      </span>
                    </div>
                    
                    <div className="overlayBottom">
                      <div className="overlayName">{product.name}</div>
                      {product.modelCode && <div className="overlayModel">Mod: {product.modelCode}</div>}
                    </div>

                    {!isOut && (
                      <button
                        className="productAddBtn"
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        aria-label={`Añadir ${product.name}`}
                      >
                        <Plus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT: Cart Overlay ────────────────────────────────────────────── */}
      <div className={`cartOverlay ${isCartOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}>
        <div className="posCart">
          <div className="cartHeader">
            <h2>
              <ShoppingCart size={17} />
              Carrito
              {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {cart.length > 0 && (
                <button className="cartClearBtn" onClick={clearCart}>
                  Limpiar
                </button>
              )}
              <button className="cartCloseBtn" onClick={() => setIsCartOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="cartEmpty">
            <ShoppingCart size={40} />
            <p>Agrega productos haciendo clic en las tarjetas.</p>
          </div>
        ) : (
          <div className="cartItems">
            {cart.map((line) => (
              <div key={line.product.id} className="cartItem">
                <span className="cartItemName">{line.product.name}</span>
                <div className="cartItemQty">
                  <button className="qtyBtn" onClick={() => updateQty(line.product.id, -1)}>
                    <Minus size={12} />
                  </button>
                  <span className="qtyValue">{line.quantity}</span>
                  <button
                    className="qtyBtn"
                    onClick={() => updateQty(line.product.id, 1)}
                    disabled={line.quantity >= Number(line.product.stock)}
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="cartItemTotal">
                  {fmt(line.quantity * Number(line.product.salePrice))}
                </span>
                <button className="cartItemRemove" onClick={() => removeFromCart(line.product.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Config */}
        <div className="cartConfig">
          <div className="cartConfigRow">
            <div>
              <div className="cartLabel">Comprobante</div>
              <select
                id="voucher-type"
                className="cartSelect"
                value={voucherTypeId}
                onChange={(e) => setVoucherTypeId(e.target.value)}
              >
                {voucherTypes.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="cartLabel">Método de Pago</div>
              <select
                id="payment-method"
                className="cartSelect"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
              >
                {paymentMethods.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="cartLabel">Cliente</div>
            <select
              id="client-select"
              className="cartSelect"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">— Venta Rápida (sin cliente) —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.documentType}: {c.documentNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Totals */}
        <div className="cartTotals">
          <div className="cartTotalRow">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="cartTotalRow grand">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          id="checkout-btn"
          className="checkoutBtn"
          disabled={cart.length === 0}
          onClick={() => { setSaleResult(null); setSaleError(null); setShowModal(true); setIsCartOpen(false); }}
        >
          <ShoppingCart size={18} />
          Cobrar {cart.length > 0 ? fmt(total) : ""}
        </button>
      </div>
      </div>

      {/* Floating Cart Button */}
      <button className="floatingCartBtn" onClick={() => setIsCartOpen(true)} aria-label="Abrir carrito">
        <ShoppingCart size={24} />
        {cartCount > 0 && <span className="floatingCartBadge">{cartCount}</span>}
      </button>

      {/* ── MODAL: Checkout ────────────────────────────────────────────────── */}
      {showModal && (
        <div className="modalOverlay" onClick={(e) => e.target === e.currentTarget && !submitting && setShowModal(false)}>
          <div className="modalCard">

            {/* ── RECEIPT (Success) ── */}
            {saleResult ? (
              <div className="receiptCard">
                <div className="receiptIcon">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="receiptTitle">¡Venta registrada!</h2>
                <p className="receiptSerie">Serie: {saleResult.serie}</p>

                <div className="receiptGrid">
                  <div className="receiptRow">
                    <span>Comprobante</span>
                    <span>{saleResult.voucherType.name}</span>
                  </div>
                  <div className="receiptRow">
                    <span>Método de pago</span>
                    <span>{saleResult.paymentMethod.name}</span>
                  </div>
                  <div className="receiptRow">
                    <span>Subtotal</span>
                    <span>{fmt(Number(saleResult.subtotal))}</span>
                  </div>
                  <div className="receiptRow">
                    <span>Total</span>
                    <span style={{ fontWeight: 700, color: "var(--green)" }}>{fmt(Number(saleResult.total))}</span>
                  </div>
                  <div className="receiptRow">
                    <span>Recibido</span>
                    <span>{fmt(Number(saleResult.amountReceived))}</span>
                  </div>
                  <div className="receiptRow change">
                    <span>Vuelto</span>
                    <span>{fmt(Number(saleResult.changeAmount))}</span>
                  </div>
                </div>

                <button className="receiptNewSaleBtn" onClick={handleNewSale} id="new-sale-btn">
                  Nueva Venta
                </button>
              </div>

            ) : (
              /* ── PAYMENT FORM ── */
              <>
                <h2 className="modalTitle">Confirmar Cobro</h2>
                <p className="modalSubtitle">Ingresa el monto recibido del cliente.</p>

                <div className="modalSummary">
                  <div className="modalSummaryRow">
                    <span>Productos ({cartCount})</span>
                    <span>{fmt(subtotal)}</span>
                  </div>
                  <div className="modalSummaryRow big">
                    <span>Total a cobrar</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <label className="cartLabel" htmlFor="amount-received">
                  Monto recibido (S/)
                </label>
                <input
                  id="amount-received"
                  className="modalInput"
                  type="number"
                  min={total}
                  step="0.50"
                  placeholder={`Mínimo ${fmt(total)}`}
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  autoFocus
                />

                <div className={`changeDisplay${change === null ? " insufficient" : ""}`}>
                  <span>Vuelto estimado</span>
                  <strong>
                    {change !== null ? fmt(change) : "Monto insuficiente"}
                  </strong>
                </div>

                {saleError && (
                  <p style={{ color: "var(--red)", fontSize: "0.82rem", margin: "-10px 0 12px" }}>
                    {saleError}
                  </p>
                )}

                <div className="modalActions">
                  <button onClick={() => setShowModal(false)} disabled={submitting}>
                    Cancelar
                  </button>
                  <button
                    id="confirm-sale-btn"
                    onClick={handleConfirmSale}
                    disabled={submitting || received < total}
                  >
                    {submitting ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        Procesando...
                      </span>
                    ) : (
                      "Confirmar Venta"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
