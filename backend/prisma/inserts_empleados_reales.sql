INSERT INTO empleados (
  full_name,
  dni,
  position,
  phone,
  hire_date,
  daily_pay,
  active,
  updated_at
) VALUES
  ('Carlos Mendoza Rivas', '73124589', 'Jefe de ventas', '987654210', DATE '2024-02-05', 145.00, true, now()),
  ('Maria Fernanda Lopez Castro', '74896521', 'Cajera principal', '987321654', DATE '2024-03-12', 110.00, true, now()),
  ('Luis Alberto Quispe Huaman', '70214563', 'Vendedor de mostrador', '965874123', DATE '2024-04-18', 95.00, true, now()),
  ('Rosa Elena Paredes Soto', '71639852', 'Asesora comercial', '956321478', DATE '2024-05-07', 98.00, true, now()),
  ('Jorge Luis Ramirez Torres', '76985412', 'Encargado de almacen', '943216578', DATE '2023-11-20', 120.00, true, now()),
  ('Ana Lucia Gutierrez Flores', '73568149', 'Auxiliar de inventario', '932145687', DATE '2024-06-03', 88.00, true, now()),
  ('Miguel Angel Salazar Vega', '72145896', 'Repartidor', '954789632', DATE '2024-01-15', 90.00, true, now()),
  ('Karla Milagros Torres Diaz', '75896321', 'Atencion al cliente', '963258741', DATE '2024-07-22', 92.00, true, now()),
  ('Victor Hugo Campos Neyra', '70963258', 'Supervisor de tienda', '978541263', DATE '2023-09-04', 135.00, true, now()),
  ('Diana Carolina Herrera Leon', '74521879', 'Asistente administrativo', '951753468', DATE '2024-08-10', 105.00, true, now()),
  ('Pedro Antonio Vargas Silva', '72859631', 'Tecnico de productos', '969852147', DATE '2024-09-02', 112.00, true, now()),
  ('Fiorella Andrea Rojas Medina', '73965482', 'Vendedora de campo', '941236589', DATE '2024-10-14', 100.00, true, now())
ON CONFLICT (dni) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  position = EXCLUDED.position,
  phone = EXCLUDED.phone,
  hire_date = EXCLUDED.hire_date,
  daily_pay = EXCLUDED.daily_pay,
  active = EXCLUDED.active,
  updated_at = now();
