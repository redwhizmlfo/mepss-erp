"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { DashboardView } from "@/features/dashboard/DashboardView";

export function HomeClient() {
  return (
    <AuthGate>
      {() => <DashboardView />}
    </AuthGate>
  );
}
