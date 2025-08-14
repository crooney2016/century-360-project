"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function NotificationsPage() {
  return (
    <ComingSoon
      title="Notifications Center"
      description="View all your notifications, alerts, and system messages in one place."
      todos={[
        "Build real-time notification system",
        "Create notification preferences and settings",
        "Implement push notifications for mobile",
        "Add email notification templates",
        "Build notification history and archiving",
        "Create notification categories and filtering",
        "Add notification analytics and read receipts",
      ]}
      fallbackRoute="/"
    />
  );
}
