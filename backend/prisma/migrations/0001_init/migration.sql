CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE empleados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(160) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  position VARCHAR(120) NOT NULL,
  phone VARCHAR(40),
  hire_date DATE NOT NULL,
  daily_pay NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (daily_pay >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  employee_id UUID NULL REFERENCES empleados(id),
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_access_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  module_key VARCHAR(50) NOT NULL,
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_create BOOLEAN NOT NULL DEFAULT FALSE,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_delete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_key)
);

CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categorias(id),
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  unit_name VARCHAR(60) NOT NULL,
  stock NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  sale_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  cost_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  icon_code VARCHAR(50),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE imagenes_producto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 1 CHECK (sort_order BETWEEN 1 AND 4),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, sort_order)
);

CREATE TABLE proveedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(180) NOT NULL,
  ruc VARCHAR(20) NOT NULL UNIQUE,
  contact_name VARCHAR(140),
  phone VARCHAR(40),
  email VARCHAR(160),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE proveedor_categoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  UNIQUE(supplier_id, category_id)
);

CREATE TABLE metodos_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tipos_comprobante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  series_prefix VARCHAR(20),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(20) NOT NULL,
  document_number VARCHAR(30) NOT NULL,
  name VARCHAR(180) NOT NULL,
  address VARCHAR(220),
  phone VARCHAR(40),
  email VARCHAR(160),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(document_type, document_number)
);

CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serie VARCHAR(40) NOT NULL UNIQUE,
  voucher_type_id UUID NOT NULL REFERENCES tipos_comprobante(id),
  payment_method_id UUID NOT NULL REFERENCES metodos_pago(id),
  client_id UUID NULL REFERENCES clientes(id),
  employee_id UUID NOT NULL REFERENCES empleados(id),
  sale_date DATE NOT NULL,
  sale_time TIME NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount_pct >= 0),
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  note TEXT,
  amount_received NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_received >= 0),
  change_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_venta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES productos(id),
  product_name_snapshot VARCHAR(180) NOT NULL,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE asistencias_empleado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES empleados(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  check_in_time TIME NULL,
  check_out_time TIME NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('asistio','falto','en_turno','pendiente')),
  source VARCHAR(30) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','auto_close','system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, work_date)
);

CREATE TABLE motivos_perdida (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE perdidas_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES productos(id),
  category_id UUID NOT NULL REFERENCES categorias(id),
  supplier_id UUID NULL REFERENCES proveedores(id),
  employee_id UUID NULL REFERENCES empleados(id),
  loss_reason_id UUID NOT NULL REFERENCES motivos_perdida(id),
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12,2) NOT NULL CHECK (unit_cost >= 0),
  total_cost NUMERIC(12,2) NOT NULL CHECK (total_cost >= 0),
  loss_date DATE NOT NULL,
  loss_time TIME NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE boletas_pago_empleado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_number VARCHAR(40) NOT NULL UNIQUE,
  employee_id UUID NOT NULL REFERENCES empleados(id),
  period_year INTEGER NOT NULL CHECK (period_year >= 2000),
  period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  issue_date DATE NOT NULL,
  days_worked INTEGER NOT NULL DEFAULT 0 CHECK (days_worked >= 0),
  daily_pay NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (daily_pay >= 0),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discounts NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discounts >= 0),
  net_total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (net_total >= 0),
  created_by_user_id UUID NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_boleta_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_slip_id UUID NOT NULL REFERENCES boletas_pago_empleado(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  check_in_time TIME NULL,
  check_out_time TIME NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount >= 0)
);

CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES productos(id),
  movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN ('sale_out','manual_in','manual_out','loss_out','adjustment')),
  reference_type VARCHAR(40) NULL,
  reference_id UUID NULL,
  quantity NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(12,2) NULL CHECK (unit_cost IS NULL OR unit_cost >= 0),
  note TEXT,
  created_by_user_id UUID NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usuarios_role_id ON usuarios(role_id);
CREATE INDEX idx_usuarios_employee_id ON usuarios(employee_id);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_productos_category_active ON productos(category_id, active);
CREATE INDEX idx_imagenes_producto_product_id ON imagenes_producto(product_id);
CREATE INDEX idx_clientes_name ON clientes(name);
CREATE INDEX idx_ventas_created_at ON ventas(created_at);
CREATE INDEX idx_ventas_employee_created_at ON ventas(employee_id, created_at);
CREATE INDEX idx_ventas_client_created_at ON ventas(client_id, created_at);
CREATE INDEX idx_detalle_venta_product_id ON detalle_venta(product_id);
CREATE INDEX idx_asistencias_empleado_work_date ON asistencias_empleado(work_date);
CREATE INDEX idx_perdidas_inventario_loss_date ON perdidas_inventario(loss_date);
CREATE INDEX idx_boletas_pago_empleado_employee_period ON boletas_pago_empleado(employee_id, period_year, period_month);
CREATE INDEX idx_movimientos_inventario_product_created_at ON movimientos_inventario(product_id, created_at);

INSERT INTO roles (code, name) VALUES
('admin', 'Administrador'),
('empleado', 'Empleado')
ON CONFLICT (code) DO NOTHING;

INSERT INTO metodos_pago (code, name) VALUES
('efectivo', 'Efectivo'),
('yape', 'Yape'),
('plin', 'Plin'),
('tarjeta', 'Tarjeta'),
('transferencia', 'Transferencia')
ON CONFLICT (code) DO NOTHING;

INSERT INTO tipos_comprobante (code, name, series_prefix) VALUES
('boleta', 'Boleta', 'B001'),
('factura', 'Factura', 'F001'),
('sin_comprobante', 'Sin comprobante', 'SC01')
ON CONFLICT (code) DO NOTHING;

INSERT INTO motivos_perdida (name) VALUES
('rotura'),
('faltante'),
('humedad'),
('merma'),
('dano_transporte'),
('ajuste_inventario')
ON CONFLICT (name) DO NOTHING;

COMMIT;
