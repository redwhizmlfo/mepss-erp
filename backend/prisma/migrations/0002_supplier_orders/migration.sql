CREATE TABLE pedidos_proveedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES proveedores(id),
  order_number VARCHAR(40) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL CHECK (status IN ('borrador','enviado','recibido','cancelado')),
  order_date DATE NOT NULL,
  expected_date DATE NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  note TEXT,
  created_by_user_id UUID NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_pedido_proveedor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_order_id UUID NOT NULL REFERENCES pedidos_proveedor(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES productos(id),
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12,2) NOT NULL CHECK (unit_cost >= 0),
  line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX idx_pedidos_proveedor_supplier_status ON pedidos_proveedor(supplier_id, status);
CREATE INDEX idx_detalle_pedido_proveedor_product_id ON detalle_pedido_proveedor(product_id);
