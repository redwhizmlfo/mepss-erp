"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { AdminUsersView } from "@/features/admin-users/AdminUsersView";

export function AdminUsersClient() {
  return (
    <AuthGate>
      {({ token }) => <AdminUsersView token={token} />}
    </AuthGate>
  );
}
