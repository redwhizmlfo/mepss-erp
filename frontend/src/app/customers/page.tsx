"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { CustomersView } from "@/features/customers/CustomersView";

export default function CustomersPage() {
  return (
    <AuthGate>
      {(session) => <CustomersView token={session.token} />}
    </AuthGate>
  );
}
