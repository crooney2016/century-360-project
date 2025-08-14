"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function CartPage() {
  return (
    <ComingSoon
      title="Shopping Cart"
      description="Manage your cart items, apply discounts, and proceed to checkout with ease."
      todos={[
        "Build cart item management (add, remove, update quantities)",
        "Implement discount code and coupon system",
        "Add shipping cost calculator",
        "Create saved cart functionality",
        "Build cart abandonment recovery",
        "Add estimated delivery dates",
        "Implement inventory validation",
      ]}
      fallbackRoute="/"
    />
  );
}
