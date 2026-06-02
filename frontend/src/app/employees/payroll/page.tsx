"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { PayrollView } from "@/features/employees/PayrollView";

export default function EmployeePayrollPage() {
  return (
    <AuthGate>
      {(session) => <PayrollView token={session.token} />}
    </AuthGate>
  );
}
