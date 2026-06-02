-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(160) NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "position" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(40),
    "hire_date" DATE NOT NULL,
    "daily_pay" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "employee_id" UUID,
    "username" VARCHAR(80) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_access_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "module_key" VARCHAR(50) NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(140) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "brand" VARCHAR(120),
    "model_code" VARCHAR(80),
    "specs" VARCHAR(500),
    "unit_name" VARCHAR(60) NOT NULL,
    "stock" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reserved_qty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "min_stock" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sale_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cost_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "icon_code" VARCHAR(50),
    "image_url" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "sort_order" SMALLINT NOT NULL DEFAULT 1,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagenes_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "business_name" VARCHAR(180) NOT NULL,
    "ruc" VARCHAR(20) NOT NULL,
    "contact_name" VARCHAR(140),
    "phone" VARCHAR(40),
    "email" VARCHAR(160),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedor_categoria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "proveedor_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_comprobante" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "series_prefix" VARCHAR(20),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document_type" VARCHAR(20) NOT NULL,
    "document_number" VARCHAR(30) NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "address" VARCHAR(220),
    "phone" VARCHAR(40),
    "email" VARCHAR(160),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serie" VARCHAR(40) NOT NULL,
    "voucher_type_id" UUID NOT NULL,
    "payment_method_id" UUID NOT NULL,
    "client_id" UUID,
    "employee_id" UUID NOT NULL,
    "sale_date" DATE NOT NULL,
    "sale_time" TIME(6) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "amount_received" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "change_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_venta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sale_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_name_snapshot" VARCHAR(180) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asistencias_empleado" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "employee_id" UUID NOT NULL,
    "work_date" DATE NOT NULL,
    "check_in_time" TIME(6),
    "check_out_time" TIME(6),
    "status" VARCHAR(30) NOT NULL,
    "source" VARCHAR(30) NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asistencias_empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motivos_perdida" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "motivos_perdida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perdidas_inventario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "supplier_id" UUID,
    "employee_id" UUID,
    "loss_reason_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "loss_date" DATE NOT NULL,
    "loss_time" TIME(6) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "perdidas_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletas_pago_empleado" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slip_number" VARCHAR(40) NOT NULL,
    "employee_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "period_month" INTEGER NOT NULL,
    "issue_date" DATE NOT NULL,
    "days_worked" INTEGER NOT NULL DEFAULT 0,
    "daily_pay" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discounts" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boletas_pago_empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_boleta_pago" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payroll_slip_id" UUID NOT NULL,
    "work_date" DATE NOT NULL,
    "check_in_time" TIME(6),
    "check_out_time" TIME(6),
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "detalle_boleta_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "movement_type" VARCHAR(30) NOT NULL,
    "reference_type" VARCHAR(40),
    "reference_id" UUID,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_cost" DECIMAL(12,2),
    "note" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_proveedor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_id" UUID NOT NULL,
    "order_number" VARCHAR(40) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "order_date" DATE NOT NULL,
    "expected_date" DATE,
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_pedido_proveedor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_cost" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_pedido_proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE UNIQUE INDEX "empleados_dni_key" ON "empleados"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_module_key_key" ON "user_permissions"("user_id", "module_key");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_name_key" ON "categorias"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "imagenes_producto_product_id_sort_order_key" ON "imagenes_producto"("product_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_ruc_key" ON "proveedores"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "proveedor_categoria_supplier_id_category_id_key" ON "proveedor_categoria"("supplier_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_pago_code_key" ON "metodos_pago"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_comprobante_code_key" ON "tipos_comprobante"("code");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_document_type_document_number_key" ON "clientes"("document_type", "document_number");

-- CreateIndex
CREATE UNIQUE INDEX "ventas_serie_key" ON "ventas"("serie");

-- CreateIndex
CREATE UNIQUE INDEX "asistencias_empleado_employee_id_work_date_key" ON "asistencias_empleado"("employee_id", "work_date");

-- CreateIndex
CREATE UNIQUE INDEX "motivos_perdida_name_key" ON "motivos_perdida"("name");

-- CreateIndex
CREATE UNIQUE INDEX "boletas_pago_empleado_slip_number_key" ON "boletas_pago_empleado"("slip_number");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_proveedor_order_number_key" ON "pedidos_proveedor"("order_number");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "empleados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_producto" ADD CONSTRAINT "imagenes_producto_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedor_categoria" ADD CONSTRAINT "proveedor_categoria_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "proveedores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedor_categoria" ADD CONSTRAINT "proveedor_categoria_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_voucher_type_id_fkey" FOREIGN KEY ("voucher_type_id") REFERENCES "tipos_comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asistencias_empleado" ADD CONSTRAINT "asistencias_empleado_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "empleados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdidas_inventario" ADD CONSTRAINT "perdidas_inventario_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdidas_inventario" ADD CONSTRAINT "perdidas_inventario_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdidas_inventario" ADD CONSTRAINT "perdidas_inventario_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdidas_inventario" ADD CONSTRAINT "perdidas_inventario_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "empleados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perdidas_inventario" ADD CONSTRAINT "perdidas_inventario_loss_reason_id_fkey" FOREIGN KEY ("loss_reason_id") REFERENCES "motivos_perdida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletas_pago_empleado" ADD CONSTRAINT "boletas_pago_empleado_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletas_pago_empleado" ADD CONSTRAINT "boletas_pago_empleado_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_boleta_pago" ADD CONSTRAINT "detalle_boleta_pago_payroll_slip_id_fkey" FOREIGN KEY ("payroll_slip_id") REFERENCES "boletas_pago_empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_proveedor" ADD CONSTRAINT "pedidos_proveedor_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "proveedores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_proveedor" ADD CONSTRAINT "pedidos_proveedor_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido_proveedor" ADD CONSTRAINT "detalle_pedido_proveedor_supplier_order_id_fkey" FOREIGN KEY ("supplier_order_id") REFERENCES "pedidos_proveedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido_proveedor" ADD CONSTRAINT "detalle_pedido_proveedor_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

