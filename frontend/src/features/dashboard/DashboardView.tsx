"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const kpis = [
  { label: "Ingresos Brutos", value: "$842.1K", trend: "+12.4%", tone: "good" },
  { label: "Pedidos Activos", value: "1,248", trend: "+5.1%", tone: "good" },
  { label: "Cant. Productos", value: "42,019", trend: "ESTABLE", tone: "neutral" },
  { label: "Horas Empleados", value: "8,420", trend: "-2.0%", tone: "warning" },
  { label: "Entregas Prov.", value: "98.2%", trend: "+0.5%", tone: "good" },
  { label: "Sistema Activo", value: "99.9%", trend: "ÓPTIMO", tone: "neutral" },
  { label: "Usuarios Activos", value: "452", trend: "PICO", tone: "neutral" },
  { label: "Tasa Errores", value: "0.04%", trend: "-10%", tone: "good" }
];

const salesVelocity = [
  { day: "LUN", value: 40 },
  { day: "MAR", value: 65 },
  { day: "MIE", value: 45 },
  { day: "JUE", value: 85 },
  { day: "VIE", value: 60 },
  { day: "SAB", value: 80 },
  { day: "DOM", value: 95 }
];

const inventoryDist = [
  { name: "MAQUINARIA", value: 90 },
  { name: "FERRETERÍA", value: 75 },
  { name: "SEGURIDAD", value: 60 },
  { name: "CONSUMIBLES", value: 45 }
];

export function DashboardView() {
  return (
    <section className="dashboard">
      <div className="metricGrid">
        {kpis.map((kpi) => (
          <article className="metricCard" key={kpi.label}>
            <div className="metricTop">
              <span className="metricLabel">{kpi.label}</span>
            </div>
            <div className="metricBottom">
              <strong className="metricValue">{kpi.value}</strong>
              <span className={`metricTrend ${kpi.tone === "warning" ? "negative" : ""}`}>
                {kpi.trend}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboardGrid">
        <section className="panel">
          <div className="panelHeader">
            <h2>Ventas Semanales</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={salesVelocity} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#A3A3A3", fontFamily: "monospace" }} dy={10} />
              <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.05)" }} />
              <Bar dataKey="value" fill="#FFF000" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <h2>Distribución de Inventario</h2>
          </div>
          <div className="progressList">
            {inventoryDist.map((item) => (
              <div className="progressItem" key={item.name}>
                <div className="progressHeader">
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="progressTrack">
                  <div className="progressBar" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
