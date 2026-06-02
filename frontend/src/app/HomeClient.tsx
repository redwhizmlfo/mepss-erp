"use client";

import dynamic from "next/dynamic";
import { AuthGate } from "@/features/auth/AuthGate";

const DashboardView = dynamic(
  () => import("@/features/dashboard/DashboardView").then((module) => module.DashboardView),
  {
    ssr: false,
    loading: () => (
      <section className="dashboard">
        <div className="metricGrid">
          {Array.from({ length: 8 }).map((_, index) => (
            <article className="metricCard skeletonBlock" key={index} />
          ))}
        </div>
      </section>
    )
  }
);

export function HomeClient() {
  return (
    <AuthGate>
      {() => <DashboardView />}
    </AuthGate>
  );
}
