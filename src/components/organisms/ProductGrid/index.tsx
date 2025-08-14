"use client";

import { SimpleGrid } from "@chakra-ui/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/catalog";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
}
