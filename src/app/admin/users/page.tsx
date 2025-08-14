"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function UsersPage() {
  return (
    <ComingSoon
      title="User Management"
      description="Manage user accounts, permissions, and access control for your organization."
      todos={[
        "Build user list with search and filtering",
        "Create user profile management interface",
        "Implement role-based access control",
        "Add user invitation and onboarding system",
        "Build bulk user operations (import/export)",
        "Create user activity monitoring",
        "Add user session management and security",
      ]}
      fallbackRoute="/admin"
    />
  );
}
