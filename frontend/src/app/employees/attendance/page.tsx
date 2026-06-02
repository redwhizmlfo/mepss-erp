"use client";

import { AuthGate } from "@/features/auth/AuthGate";
import { AttendanceView } from "@/features/employees/AttendanceView";

export default function EmployeeAttendancePage() {
  return (
    <AuthGate>
      {(session) => <AttendanceView token={session.token} />}
    </AuthGate>
  );
}
