"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { InventoryClient } from "./InventoryClient";

export default function InventoryProductsPage() {
  return (
    <AuthGate>
      {(session) => <InventoryClient token={session.token} />}
    </AuthGate>
  );
}
