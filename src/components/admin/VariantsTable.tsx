"use client";

import * as React from "react";
import { VStack, Box, Text, Heading } from "@chakra-ui/react";

export default function VariantsTable() {
  return (
    <VStack spacing={4} align="stretch">
      <Box bg="white" border="1px" borderColor="gray.200" borderRadius="2xl" p={6}>
        <Heading size="md" mb={4}>
          Variants Table
        </Heading>
        <Text color="gray.600">Variants table component is being updated...</Text>
      </Box>
    </VStack>
  );
}
