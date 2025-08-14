"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function ProfilePage() {
  return (
    <ComingSoon
      title="User Profile"
      description="View and edit your personal information, preferences, and account settings."
      todos={[
        "Build user profile form with validation",
        "Add avatar upload and image cropping",
        "Implement password change functionality",
        "Create privacy and security settings",
        "Add two-factor authentication setup",
        "Build account activity log",
        "Create data export and account deletion options",
      ]}
      fallbackRoute="/"
    />
  );
}
