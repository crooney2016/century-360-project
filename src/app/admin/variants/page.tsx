"use client";

import { Container, Heading, VStack } from "@chakra-ui/react";
import VariantsTable from "@/components/admin/VariantsTable";

export default function VariantsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8} align="stretch">
        <Heading size="lg">Product Variants</Heading>
        <VariantsTable />
      </VStack>
    </Container>
  );
}
