"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { SalesModuleView } from "@/features/sales/SalesModuleView";

export function SalesModuleClient() {
  return (
    <AuthGate>
      {() => <SalesModuleView />}
    </AuthGate>
  );
}
