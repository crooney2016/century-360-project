"use client";

import { motion } from "framer-motion";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { Product } from "@/types/catalog";
import { cardEntrance, buttonHover } from "../../../lib/animations";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardEntrance}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div variants={buttonHover} initial="initial" whileHover="hover" whileTap="tap">
        <Box
          borderRadius="4px"
          border="1px"
          borderColor="slate.200"
          bg="white"
          p={3}
          transition="all 0.2s ease"
          _hover={{
            boxShadow: "lg",
            borderColor: "blue.200",
          }}
          cursor="pointer"
        >
          <VStack align="stretch" gap={1}>
            <Text fontSize="xs" color="slate.500">
              {product.ItemNumber}
            </Text>
            <Text fontSize="sm" fontWeight="medium" color="slate.900">
              {product.Name}
            </Text>
            <Text fontSize="sm" color="slate.700">
              ${product.RetailPriceMin.toFixed(2)}
            </Text>
          </VStack>
        </Box>
      </motion.div>
    </motion.div>
  );
}
