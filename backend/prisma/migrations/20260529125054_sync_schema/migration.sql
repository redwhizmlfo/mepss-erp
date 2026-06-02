-- DropForeignKey
ALTER TABLE "asistencias_empleado" DROP CONSTRAINT "asistencias_empleado_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "boletas_pago_empleado" DROP CONSTRAINT "boletas_pago_empleado_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "boletas_pago_empleado" DROP CONSTRAINT "boletas_pago_empleado_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_boleta_pago" DROP CONSTRAINT "detalle_boleta_pago_payroll_slip_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_pedido_proveedor" DROP CONSTRAINT "detalle_pedido_proveedor_product_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_pedido_proveedor" DROP CONSTRAINT "detalle_pedido_proveedor_supplier_order_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_venta" DROP CONSTRAINT "detalle_venta_product_id_fkey";

-- DropForeignKey
ALTER TABLE "detalle_venta" DROP CONSTRAINT "detalle_venta_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "imagenes_producto" DROP CONSTRAINT "imagenes_producto_product_id_fkey";

-- DropForeignKey
ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "movimientos_inventario_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "movimientos_inventario_product_id_fkey";

-- DropForeignKey
ALTER TABLE "pedidos_proveedor" DROP CONSTRAINT "pedidos_proveedor_created_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pedidos_proveedor" DROP CONSTRAINT "pedidos_proveedor_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "perdidas_inventario" DROP CONSTRAINT "perdidas_inventario_category_id_fkey";

-- DropForeignKey
ALTER TABLE "perdidas_inventario" DROP CONSTRAINT "perdidas_inventario_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "perdidas_inventario" DROP CONSTRAINT "perdidas_inventario_loss_reason_id_fkey";

-- DropForeignKey
ALTER TABLE "perdidas_inventario" DROP CONSTRAINT "perdidas_inventario_product_id_fkey";

-- DropForeignKey
ALTER TABLE "perdidas_inventario" DROP CONSTRAINT "perdidas_inventario_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_category_id_fkey";

-- DropForeignKey
ALTER TABLE "proveedor_categoria" DROP CONSTRAINT "proveedor_categoria_category_id_fkey";

-- DropForeignKey
ALTER TABLE "proveedor_categoria" DROP CONSTRAINT "proveedor_categoria_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "user_permissions" DROP CONSTRAINT "user_permissions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_role_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_client_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_payment_method_id_fkey";

-- DropForeignKey
ALTER TABLE "ventas" DROP CONSTRAINT "ventas_voucher_type_id_fkey";

-- DropIndex
DROP INDEX "idx_asistencias_empleado_work_date";

-- DropIndex
DROP INDEX "idx_boletas_pago_empleado_employee_period";

-- DropIndex
DROP INDEX "idx_clientes_name";

-- DropIndex
DROP INDEX "idx_detalle_pedido_proveedor_product_id";

-- DropIndex
DROP INDEX "idx_detalle_venta_product_id";

-- DropIndex
DROP INDEX "idx_imagenes_producto_product_id";

-- DropIndex
DROP INDEX "idx_movimientos_inventario_product_created_at";

-- DropIndex
DROP INDEX "idx_pedidos_proveedor_supplier_status";

-- DropIndex
DROP INDEX "idx_perdidas_inventario_loss_date";

-- DropIndex
DROP INDEX "idx_productos_category_active";

-- DropIndex
DROP INDEX "idx_user_permissions_user_id";

-- DropIndex
DROP INDEX "idx_usuarios_employee_id";

-- DropIndex
DROP INDEX "idx_usuarios_role_id";

-- DropIndex
DROP INDEX "idx_ventas_client_created_at";

-- DropIndex
DROP INDEX "idx_ventas_created_at";

-- DropIndex
DROP INDEX "idx_ventas_employee_created_at";

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "brand" VARCHAR(120),
ADD COLUMN     "model_code" VARCHAR(80),
ADD COLUMN     "reserved_qty" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "specs" VARCHAR(500);

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
