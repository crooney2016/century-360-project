"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function CatalogPage() {
  return (
    <ComingSoon
      title="Product Catalog"
      description="Browse our complete product catalog with advanced filtering, search, and comparison features."
      todos={[
        "Implement product grid layout with infinite scroll",
        "Add advanced filtering by category, price, and attributes",
        "Build product search with autocomplete",
        "Create product comparison feature",
        "Add wishlist and favorites functionality",
        "Implement product reviews and ratings",
      ]}
      fallbackRoute="/"
    />
  );
}
