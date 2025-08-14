"use client";

import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  HStack,
  VStack,
  Select,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useProductStore } from "@/stores/useProductStore";
import type { Product } from "@/stores/useProductStore";
import { useNavigation } from "@/contexts/NavigationContext";
import { FiEye, FiSearch, FiFilter } from "react-icons/fi";

export default function AdminProductsPage() {
  const {
    products,
    loading,
    loadingMore,
    error,
    hasNextPage,
    fetchProducts,
    fetchMoreProducts,
    updateFilters,
  } = useProductStore();
  const { openRightPanel } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  const toast = (options: { title: string; status?: string; duration?: number }) =>
    console.log(options.title);

  const formatPrice = (priceStr: string) => {
    const price = parseFloat(priceStr);
    return isNaN(price) ? priceStr : `$${price.toFixed(2)}`;
  };

  const formatPriceRange = (minStr: string, maxStr: string) => {
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    if (isNaN(min) || isNaN(max)) {
      return `${formatPrice(minStr)} – ${formatPrice(maxStr)}`;
    }

    if (Math.abs(min - max) < 0.01) {
      return formatPrice(minStr);
    }
    return `${formatPrice(minStr)} – ${formatPrice(maxStr)}`;
  };

  const departments = [...new Set(products.map(p => p.Dept))];

  // Auto-load more when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        hasNextPage &&
        !loadingMore &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
      ) {
        fetchMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loadingMore, fetchMoreProducts]);

  // Handle filter changes
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      updateFilters({ search: value });
    },
    [updateFilters]
  );

  const handleDeptChange = useCallback(
    (value: string) => {
      setSelectedDept(value);
      updateFilters({ dept: value });
    },
    [updateFilters]
  );

  // Open product details in right panel
  const openProductDetails = (product: Product) => {
    const productDetails = (
      <VStack spacing={4} align="start">
        <Box>
          <Heading size="md">{product.Name}</Heading>
          <Text color="gray.600">Item #{product.ItemNumber}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Department:</Text>
          <Badge colorScheme="blue" variant="subtle">
            {product.Dept}
          </Badge>
        </Box>
        <Box>
          <Text fontWeight="semibold">Class:</Text>
          <Text>{product.Class}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Retail Price:</Text>
          <Text>{formatPriceRange(product.RetailPriceMin, product.RetailPriceMax)}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Wholesale Price:</Text>
          <Text>{formatPriceRange(product.WholesalePriceMin, product.WholesalePriceMax)}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Created:</Text>
          <Text>{new Date(product.CreatedAt).toLocaleDateString()}</Text>
        </Box>
      </VStack>
    );

    openRightPanel(productDetails, `Product Details: ${product.Name}`);
  };

  if (loading) {
    return (
      <Box
        p={6}
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          p={8}
        >
          <VStack spacing={4}>
            <Spinner size="lg" color="white" />
            <Text color="white" fontSize="lg">
              Loading products...
            </Text>
          </VStack>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" minH="100vh">
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
        >
          <CardBody>
            <VStack spacing={4}>
              <Heading size="md" color="red.300">
                Error Loading Products
              </Heading>
              <Text color="rgba(255, 255, 255, 0.8)">{error}</Text>
              <Button
                colorScheme="blue"
                onClick={() => fetchProducts()}
                bg="rgba(59, 130, 246, 0.2)"
                border="1px solid rgba(59, 130, 246, 0.3)"
                color="white"
                _hover={{
                  bg: "rgba(59, 130, 246, 0.3)",
                  transform: "translateY(-2px)",
                }}
              >
                Try Again
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      p={6}
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        width="200%"
        height="200%"
        bg="radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)"
        animation="float 20s ease-in-out infinite"
      />

      <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
        {/* Header */}
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          p={6}
        >
          <VStack spacing={4} align="start">
            <Heading size="lg" color="white">
              Products Management
            </Heading>
            <Text color="rgba(255, 255, 255, 0.8)">
              Manage your product catalog and inventory ({products.length} total products)
            </Text>
          </VStack>
        </Card>

        {/* Filters */}
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
        >
          <CardBody>
            <HStack spacing={4} align="center">
              <Box position="relative" flex={1}>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "rgba(255, 255, 255, 0.6)" }}
                  _focus={{
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)",
                  }}
                  pl={10}
                />
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                  <FiSearch color="rgba(255, 255, 255, 0.6)" />
                </Box>
              </Box>
              <Box position="relative">
                <Select
                  placeholder="All Departments"
                  value={selectedDept}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleDeptChange(e.target.value)
                  }
                  bg="rgba(255, 255, 255, 0.1)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="white"
                  _focus={{
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.2)",
                  }}
                  minW="200px"
                >
                  <option value="" style={{ background: "#4a5568" }}>
                    All Departments
                  </option>
                  {departments.map(dept => (
                    <option key={dept} value={dept} style={{ background: "#4a5568" }}>
                      {dept}
                    </option>
                  ))}
                </Select>
                <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                  <FiFilter color="rgba(255, 255, 255, 0.6)" />
                </Box>
              </Box>
              <Button
                colorScheme="blue"
                onClick={() =>
                  toast({
                    title: "Filter applied",
                    status: "success",
                    duration: 2000,
                  })
                }
                bg="rgba(59, 130, 246, 0.2)"
                border="1px solid rgba(59, 130, 246, 0.3)"
                color="white"
                _hover={{
                  bg: "rgba(59, 130, 246, 0.3)",
                  transform: "translateY(-2px)",
                }}
              >
                Apply Filters
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Products Table with Infinite Scroll */}
        <Card
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
          borderRadius="20px"
          overflow="hidden"
        >
          <Box
            p={6}
            bg="rgba(255, 255, 255, 0.05)"
            borderBottom="1px solid rgba(255, 255, 255, 0.1)"
          >
            <HStack justify="space-between">
              <Box>
                <Heading size="md" color="white">
                  Products ({products.length})
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Showing {products.length} products
                  {hasNextPage ? " (loading more as you scroll)" : ""}
                </Text>
              </Box>
              <Button
                colorScheme="green"
                size="sm"
                bg="rgba(34, 197, 94, 0.2)"
                border="1px solid rgba(34, 197, 94, 0.3)"
                color="white"
                _hover={{
                  bg: "rgba(34, 197, 94, 0.3)",
                  transform: "translateY(-2px)",
                }}
              >
                Add Product
              </Button>
            </HStack>
          </Box>

          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr bg="rgba(255, 255, 255, 0.05)">
                  <Th color="rgba(255, 255, 255, 0.8)">Item #</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Name</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Department</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Class</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Retail Price</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Wholesale Price</Th>
                  <Th color="rgba(255, 255, 255, 0.8)">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map(product => (
                  <Tr
                    key={product.id}
                    _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}
                    transition="all 0.2s"
                  >
                    <Td color="white" fontWeight="semibold">
                      {product.ItemNumber}
                    </Td>
                    <Td color="white">{product.Name}</Td>
                    <Td>
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        bg="rgba(59, 130, 246, 0.2)"
                        color="rgba(255, 255, 255, 0.9)"
                      >
                        {product.Dept}
                      </Badge>
                    </Td>
                    <Td color="rgba(255, 255, 255, 0.8)">{product.Class}</Td>
                    <Td color="rgba(255, 255, 255, 0.8)">
                      {formatPriceRange(product.RetailPriceMin, product.RetailPriceMax)}
                    </Td>
                    <Td color="rgba(255, 255, 255, 0.8)">
                      {formatPriceRange(product.WholesalePriceMin, product.WholesalePriceMax)}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View details"
                          size="sm"
                          variant="ghost"
                          onClick={() => openProductDetails(product)}
                          color="rgba(255, 255, 255, 0.8)"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.1)",
                            color: "white",
                          }}
                        >
                          <FiEye />
                        </IconButton>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="rgba(255, 255, 255, 0.8)"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.1)",
                            color: "white",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          color="rgba(255, 255, 255, 0.8)"
                          _hover={{
                            bg: "rgba(239, 68, 68, 0.2)",
                            color: "white",
                          }}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Load more indicator */}
          {loadingMore && (
            <Box p={6} textAlign="center" bg="rgba(255, 255, 255, 0.05)">
              <Spinner size="md" color="white" />
              <Text ml={2} color="rgba(255, 255, 255, 0.8)">
                Loading more products...
              </Text>
            </Box>
          )}
          {!hasNextPage && products.length > 0 && (
            <Box p={6} textAlign="center" bg="rgba(255, 255, 255, 0.05)">
              <Text color="rgba(255, 255, 255, 0.6)">No more products to load</Text>
            </Box>
          )}
        </Card>
      </VStack>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </Box>
  );
}
