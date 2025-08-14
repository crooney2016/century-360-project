"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function OrdersPage() {
  return (
    <ComingSoon
      title="Orders Management"
      description="Track and manage customer orders, view order history, and process returns."
      todos={[
        "Build order list with advanced filtering and search",
        "Create order detail view with status tracking",
        "Implement order status updates and workflows",
        "Add return and refund processing",
        "Build order fulfillment tracking",
        "Create customer communication tools",
        "Add order analytics and reporting",
      ]}
      fallbackRoute="/admin"
    />
  );
}
