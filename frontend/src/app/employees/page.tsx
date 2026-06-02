"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { EmployeesView } from "@/features/employees/EmployeesView";

export default function EmployeesPage() {
  return (
    <AuthGate>
      {(session) => <EmployeesView token={session.token} />}
    </AuthGate>
  );
}
