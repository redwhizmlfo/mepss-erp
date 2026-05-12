"use client";

import { AlertTriangle, ArrowUpRight, Boxes, CircleDollarSign, Clock3, ReceiptText, Truck, UsersRound } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const kpis = [
  { label: "Ventas del dia", value: "S/ 3,180", trend: "+18.4%", tone: "good", icon: CircleDollarSign },
  { label: "Stock critico", value: "7", trend: "-2 hoy", tone: "warning", icon: Boxes },
  { label: "Pedidos pendientes", value: "4", trend: "2 atrasados", tone: "warning", icon: Truck },
  { label: "Asistencias abiertas", value: "3", trend: "requieren cierre", tone: "danger", icon: Clock3 },
  { label: "Clientes activos", value: "128", trend: "+9 mes", tone: "good", icon: UsersRound },
  { label: "Boletas por generar", value: "11", trend: "mayo", tone: "neutral", icon: ReceiptText }
];

const salesTrend = [
  { day: "Lun", ventas: 1200, perdidas: 90 },
  { day: "Mar", ventas: 1850, perdidas: 120 },
  { day: "Mie", ventas: 1640, perdidas: 60 },
  { day: "Jue", ventas: 2280, perdidas: 150 },
  { day: "Vie", ventas: 2540, perdidas: 130 },
  { day: "Sab", ventas: 3180, perdidas: 210 },
  { day: "Dom", ventas: 1760, perdidas: 80 }
];

const moduleMix = [
  { name: "Ventas", value: 38, color: "#9b7a2f" },
  { name: "Inventario", value: 24, color: "#123c36" },
  { name: "Pedidos", value: 16, color: "#6f3d2e" },
  { name: "Empleados", value: 14, color: "#2c4c6b" },
  { name: "Perdidas", value: 8, color: "#7d2424" }
];

const ranking = [
  ["Cemento premium", "S/ 4,920", 92],
  ["Arena fina", "S/ 3,870", 76],
  ["Pintura satinada", "S/ 2,940", 58],
  ["Tuberia PVC", "S/ 2,520", 49]
];

export function DashboardView() {
  return (
    <section className="dashboard">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Centro de mando</p>
          <h1>Dashboard ejecutivo</h1>
        </div>
        <div className="periodTabs" aria-label="Rango de metricas">
          <button>Hoy</button>
          <button className="active">Mes</button>
          <button>Trimestre</button>
        </div>
      </div>

      <div className="alertStrip">
        <AlertTriangle size={18} />
        <span>7 productos estan bajo stock minimo, 4 pedidos esperan recepcion y 3 asistencias siguen abiertas.</span>
        <a href="/inventory/low-stock">Revisar alertas <ArrowUpRight size={14} /></a>
      </div>

      <div className="metricGrid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article className={`metricCard ${kpi.tone}`} key={kpi.label}>
              <div className="metricTop">
                <Icon size={19} />
                <span>{kpi.trend}</span>
              </div>
              <strong>{kpi.value}</strong>
              <small>{kpi.label}</small>
            </article>
          );
        })}
      </div>

      <div className="dashboardGrid">
        <section className="panel wide">
          <div className="panelHeader">
            <div>
              <h2>Ingresos vs perdidas</h2>
              <p>Evolucion semanal con lectura de riesgo operativo.</p>
            </div>
            <a href="/reports/sales">Ver reporte</a>
          </div>
          <ResponsiveContainer width="100%" height={310}>
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="ventas" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#9b7a2f" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#9b7a2f" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e8dcc2" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="ventas" stroke="#9b7a2f" fill="url(#ventas)" strokeWidth={3} />
              <Area type="monotone" dataKey="perdidas" stroke="#7d2424" fill="#7d242414" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Peso por modulo</h2>
              <p>Actividad consolidada del periodo.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={moduleMix} dataKey="value" nameKey="name" innerRadius={66} outerRadius={96} paddingAngle={3}>
                {moduleMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legendList">
            {moduleMix.map((item) => (
              <span key={item.name}><i style={{ background: item.color }} />{item.name}</span>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Top productos</h2>
              <p>Ranking por facturacion estimada.</p>
            </div>
          </div>
          <div className="rankingList">
            {ranking.map(([name, amount, percent]) => (
              <div className="rankRow" key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>{amount}</span>
                </div>
                <b style={{ width: `${percent}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <h2>Actividad por hora</h2>
              <p>Bloques fuertes de venta.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { hour: "08", value: 12 },
              { hour: "10", value: 22 },
              { hour: "12", value: 34 },
              { hour: "14", value: 26 },
              { hour: "16", value: 41 },
              { hour: "18", value: 31 }
            ]}>
              <CartesianGrid stroke="#e8dcc2" vertical={false} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#123c36" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </section>
  );
}
