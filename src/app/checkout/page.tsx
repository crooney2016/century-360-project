"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function CheckoutPage() {
  return (
    <ComingSoon
      title="Checkout Process"
      description="Secure and streamlined checkout experience with multiple payment options and order confirmation."
      todos={[
        "Build multi-step checkout flow",
        "Integrate payment processing (Stripe/PayPal)",
        "Add shipping address management",
        "Implement tax calculation by location",
        "Create order summary and confirmation",
        "Add guest checkout option",
        "Build order tracking system",
        "Implement email confirmations",
      ]}
      fallbackRoute="/cart"
    />
  );
}
