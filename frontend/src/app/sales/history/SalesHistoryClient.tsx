"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { SalesHistoryView } from "@/features/sales/SalesHistoryView";

export function SalesHistoryClient() {
  return (
    <AuthGate>
      {(session) => <SalesHistoryView token={session.token} />}
    </AuthGate>
  );
}
