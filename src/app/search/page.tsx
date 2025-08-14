import { Box, Container, VStack, HStack, Text, Heading, Divider, Badge } from "@chakra-ui/react";
import { FiPackage, FiTruck, FiUsers, FiFileText } from "react-icons/fi";
import { GlassOverlay } from "@/components/atoms/GlassOverlay";
import { SearchForm } from "./SearchForm";

// Mock search results - in a real app, this would come from an API
const mockSearchResults = [
  {
    id: 1,
    type: "product",
    title: "Century 360° Training Gi",
    description: "Premium martial arts training uniform with moisture-wicking technology",
    category: "Training Equipment",
    icon: "package",
  },
  {
    id: 2,
    type: "order",
    title: "Order #C360-2024-001",
    description: "Training equipment order for Downtown Dojo",
    category: "Orders",
    icon: "truck",
  },
  {
    id: 3,
    type: "customer",
    title: "Downtown Dojo",
    description: "Martial arts school in downtown area",
    category: "Customers",
    icon: "users",
  },
  {
    id: 4,
    type: "content",
    title: "Advanced Belt Testing Guide",
    description: "Comprehensive guide for advanced belt testing procedures",
    category: "Content",
    icon: "file",
  },
];

export default function SearchPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "blue";
      case "order":
        return "green";
      case "customer":
        return "purple";
      case "content":
        return "orange";
      default:
        return "gray";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Product";
      case "order":
        return "Order";
      case "customer":
        return "Customer";
      case "content":
        return "Content";
      default:
        return "Unknown";
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "package":
        return <FiPackage />;
      case "truck":
        return <FiTruck />;
      case "users":
        return <FiUsers />;
      case "file":
        return <FiFileText />;
      default:
        return <FiPackage />;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Search Header */}
        <GlassOverlay intensity="light" p={6}>
          <VStack spacing={4}>
            <Heading size="lg" color="brand.600">
              Search Results
            </Heading>
            <Text color="gray.600" textAlign="center">
              Enter your search query below
            </Text>

            {/* Search Input */}
            <Box w="full" maxW="2xl">
              <SearchForm />
            </Box>
          </VStack>
        </GlassOverlay>

        {/* Search Results */}
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">
              {mockSearchResults.length} results found
            </Text>
          </HStack>

          <Divider />

          <VStack spacing={4} align="stretch">
            {mockSearchResults.map(item => (
              <GlassOverlay key={item.id} intensity="light" p={4}>
                <HStack spacing={4} align="start">
                  <Box
                    p={3}
                    bg={`${getTypeColor(item.type)}.100`}
                    borderRadius="lg"
                    color={`${getTypeColor(item.type)}.600`}
                  >
                    <Box boxSize={5}>{getIcon(item.icon)}</Box>
                  </Box>

                  <VStack align="start" spacing={2} flex={1}>
                    <HStack spacing={3} align="center">
                      <Text fontWeight="semibold" fontSize="lg">
                        {item.title}
                      </Text>
                      <Badge colorScheme={getTypeColor(item.type)} variant="subtle">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </HStack>

                    <Text color="gray.600" fontSize="sm">
                      {item.description}
                    </Text>

                    <Text color="gray.500" fontSize="xs">
                      Category: {item.category}
                    </Text>
                  </VStack>
                </HStack>
              </GlassOverlay>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
}
