"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  type Category,
  type Customer,
  type PaymentMethod,
  type Product,
  type VoucherType,
  listPaymentMethods,
  listProducts,
  listVoucherTypes,
  searchCustomers
} from "@/lib/api";
import { SalesPosView } from "@/features/sales/SalesPosView";

type Props = { token: string };

export function SalesPosClient({ token }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [prods, methods, vouchers, custs] = await Promise.all([
          listProducts(token),
          listPaymentMethods(token),
          listVoucherTypes(token),
          searchCustomers(token)
        ]);

        // Extraer categorías únicas de los productos
        const catMap = new Map<string, Category>();
        prods.forEach((p) => {
          if (!catMap.has(p.category.id)) catMap.set(p.category.id, p.category);
        });

        setProducts(prods);
        setCategories(Array.from(catMap.values()));
        setPaymentMethods(methods);
        setVoucherTypes(vouchers);
        setCustomers(custs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los datos del POS.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) {
    return (
      <div className="posLoading">
        <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} />
        Cargando punto de venta...
      </div>
    );
  }

  if (error) {
    return (
      <div className="posLoading" style={{ color: "var(--red)" }}>
        {error}
      </div>
    );
  }

  return (
    <SalesPosView
      token={token}
      products={products}
      categories={categories}
      paymentMethods={paymentMethods}
      voucherTypes={voucherTypes}
      customers={customers}
    />
  );
}
