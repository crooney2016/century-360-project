"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="System Settings"
      description="Configure system preferences, integrations, and company settings."
      todos={[
        "Build company information management",
        "Create integration settings for third-party services",
        "Implement theme and branding customization",
        "Add user role and permission management",
        "Build email template customization",
        "Create backup and restore functionality",
        "Add security settings and audit logs",
      ]}
      fallbackRoute="/admin"
    />
  );
}
