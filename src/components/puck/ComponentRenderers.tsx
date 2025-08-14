"use client";
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Heading,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import { CustomerCard, CustomerGrid, CustomerDataTable } from "./index";
import { getCustomers } from "../../data/customers";

// Component renderers for Puck
export const componentRenderers = {
  // Basic Content Components
  Hero: ({ title, subtitle, backgroundColor, textColor, padding }: any) => (
    <Box bg={backgroundColor} color={textColor} p={padding} textAlign="center" borderRadius="lg">
      <VStack spacing={4}>
        <Heading size="2xl">{title}</Heading>
        <Text fontSize="xl" opacity={0.9}>
          {subtitle}
        </Text>
      </VStack>
    </Box>
  ),

  FeatureCard: ({ title, description, icon, color }: any) => (
    <Box
      p={6}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      textAlign="center"
      _hover={{ shadow: "md" }}
    >
      <VStack spacing={4}>
        <Box
          w={16}
          h={16}
          bg={color}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontSize="2xl"
        >
          {icon === "star" ? "⭐" : icon}
        </Box>
        <Heading size="md">{title}</Heading>
        <Text color="gray.600">{description}</Text>
      </VStack>
    </Box>
  ),

  ContentGrid: ({ columns, gap, items }: any) => (
    <Box>
      <Text fontSize="lg" fontWeight="medium" mb={4}>
        Content Grid ({columns} columns)
      </Text>
      <Box display="grid" gridTemplateColumns={`repeat(${columns}, 1fr)`} gap={gap}>
        {Array.from({ length: Math.max(1, items?.length || 3) }, (_, i) => (
          <Box key={i} p={4} bg="gray.100" borderRadius="md" textAlign="center">
            <Text>Grid Item {i + 1}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  ),

  TextBlock: ({ text, fontSize, fontWeight, textAlign, color }: any) => (
    <Text fontSize={fontSize} fontWeight={fontWeight} textAlign={textAlign} color={color}>
      {text}
    </Text>
  ),

  // Customer Components
  CustomerCard: ({ variant, showContacts, showAddresses, showStats }: any) => {
    const customers = getCustomers();
    const customer = customers[0]; // Show first customer as example

    return (
      <Box>
        <Text fontSize="lg" fontWeight="medium" mb={4}>
          Customer Card Preview
        </Text>
        <CustomerCard
          customer={customer}
          variant={variant}
          showContacts={showContacts}
          showAddresses={showAddresses}
          showStats={showStats}
        />
      </Box>
    );
  },

  CustomerGrid: ({ displayMode, columns, gap, showFilters, showSearch, showActions }: any) => (
    <Box>
      <Text fontSize="lg" fontWeight="medium" mb={4}>
        Customer Grid ({displayMode} view, {columns} columns)
      </Text>
      <CustomerGrid
        displayMode={displayMode}
        columns={columns}
        gap={gap}
        showFilters={showFilters}
        showSearch={showSearch}
        showActions={showActions}
      />
    </Box>
  ),

  CustomerDataTable: ({
    showFilters,
    showSearch,
    showActions,
    showPagination,
    pageSize,
    maxHeight,
  }: any) => (
    <Box>
      <Text fontSize="lg" fontWeight="medium" mb={4}>
        Customer Data Table
      </Text>
      <CustomerDataTable
        showFilters={showFilters}
        showSearch={showSearch}
        showActions={showActions}
        showPagination={showPagination}
        pageSize={pageSize}
        maxHeight={maxHeight}
      />
    </Box>
  ),

  CustomerStats: ({ showRevenue, showOrders, showCounts, layout }: any) => {
    const stats = {
      total: 8,
      wholesale: 3,
      retail: 5,
      active: 7,
      totalRevenue: 8500000,
      totalOrders: 830,
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    if (layout === "vertical") {
      return (
        <VStack spacing={4} align="stretch">
          {showCounts && (
            <Box p={4} bg="blue.50" borderRadius="md">
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                Total Customers
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {stats.total}
              </Text>
            </Box>
          )}
          {showRevenue && (
            <Box p={4} bg="green.50" borderRadius="md">
              <Text fontSize="sm" color="green.600" fontWeight="medium">
                Total Revenue
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {formatCurrency(stats.totalRevenue)}
              </Text>
            </Box>
          )}
          {showOrders && (
            <Box p={4} bg="purple.50" borderRadius="md">
              <Text fontSize="sm" color="purple.600" fontWeight="medium">
                Total Orders
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {stats.totalOrders}
              </Text>
            </Box>
          )}
        </VStack>
      );
    }

    if (layout === "grid") {
      return (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {showCounts && (
            <Box p={4} bg="blue.50" borderRadius="md" textAlign="center">
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                Total Customers
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {stats.total}
              </Text>
            </Box>
          )}
          {showRevenue && (
            <Box p={4} bg="green.50" borderRadius="md" textAlign="center">
              <Text fontSize="sm" color="green.600" fontWeight="medium">
                Total Revenue
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {formatCurrency(stats.totalRevenue)}
              </Text>
            </Box>
          )}
          {showOrders && (
            <Box p={4} bg="purple.50" borderRadius="md" textAlign="center">
              <Text fontSize="sm" color="purple.600" fontWeight="medium">
                Total Orders
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {stats.totalOrders}
              </Text>
            </Box>
          )}
        </Box>
      );
    }

    // Default horizontal layout
    return (
      <HStack spacing={6} justify="center">
        {showCounts && (
          <Box p={4} bg="blue.50" borderRadius="md" textAlign="center">
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Total Customers
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {stats.total}
            </Text>
          </Box>
        )}
        {showRevenue && (
          <Box p={4} bg="green.50" borderRadius="md" textAlign="center">
            <Text fontSize="sm" color="green.600" fontWeight="medium">
              Total Revenue
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatCurrency(stats.totalRevenue)}
            </Text>
          </Box>
        )}
        {showOrders && (
          <Box p={4} bg="purple.50" borderRadius="md" textAlign="center">
            <Text fontSize="sm" color="purple.600" fontWeight="medium">
              Total Orders
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {stats.totalOrders}
            </Text>
          </Box>
        )}
      </HStack>
    );
  },

  // Layout Components
  Section: ({ title, subtitle, padding, backgroundColor, border }: any) => (
    <Box
      p={padding}
      bg={backgroundColor === "transparent" ? "transparent" : backgroundColor}
      border={border ? "1px solid" : "none"}
      borderColor="gray.200"
      borderRadius="md"
    >
      <VStack spacing={3} align="stretch">
        {title && <Heading size="md">{title}</Heading>}
        {subtitle && <Text color="gray.600">{subtitle}</Text>}
        <Box>
          <Text fontSize="sm" color="gray.500">
            Section content goes here. Drag and drop components into this section.
          </Text>
        </Box>
      </VStack>
    </Box>
  ),

  Container: ({ maxWidth, padding, centerContent }: any) => (
    <Container maxW={maxWidth} p={padding} centerContent={centerContent}>
      <VStack spacing={4} align="stretch" w="full">
        <Text fontSize="sm" color="gray.500">
          Container content goes here. Drag and drop components into this container.
        </Text>
      </VStack>
    </Container>
  ),

  // Interactive Components
  Button: ({ text, variant, colorScheme, size, isFullWidth }: any) => (
    <Button
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      w={isFullWidth ? "full" : "auto"}
    >
      {text}
    </Button>
  ),

  // Form Components
  FormField: ({ label, placeholder, type, required, helperText }: any) => (
    <FormControl isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} placeholder={placeholder} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  ),
};
