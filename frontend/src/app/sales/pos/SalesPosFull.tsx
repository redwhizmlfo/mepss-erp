"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { SalesPosClient } from "./SalesPosClient";

export function SalesPosFull() {
  return (
    <AuthGate>
      {(session) => <SalesPosClient token={session.token} />}
    </AuthGate>
  );
}
