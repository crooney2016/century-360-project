import SystemHealthDashboard from "@/components/admin/SystemHealthDashboard";
import { AdminShell } from "@/components/organisms/AdminShell";

export default function AdminStatusPage() {
  return (
    <AdminShell>
      <SystemHealthDashboard />
    </AdminShell>
  );
}
