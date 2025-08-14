"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  VStack,
  HStack,
  Badge,
  Link as ChakraLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FiBox, FiTag, FiUsers, FiSettings, FiFileText, FiShoppingCart } from "react-icons/fi";

const adminModules = [
  {
    title: "Products",
    description: "Manage your product catalog",
    icon: FiBox,
    href: "/admin/products",
    badge: "Active",
    badgeColor: "green",
  },
  {
    title: "Variants",
    description: "Manage product variants and SKUs",
    icon: FiTag,
    href: "/admin/variants",
    badge: "Active",
    badgeColor: "green",
  },
  {
    title: "Orders",
    description: "View and process customer orders",
    icon: FiShoppingCart,
    href: "/orders",
    badge: "Coming Soon",
    badgeColor: "yellow",
  },
  {
    title: "Users",
    description: "Manage user accounts and permissions",
    icon: FiUsers,
    href: "/admin/users",
    badge: "Coming Soon",
    badgeColor: "yellow",
  },
  {
    title: "Reports",
    description: "Analytics and business insights",
    icon: FiFileText,
    href: "/reports",
    badge: "Coming Soon",
    badgeColor: "yellow",
  },
  {
    title: "Settings",
    description: "Configure system preferences",
    icon: FiSettings,
    href: "/settings",
    badge: "Coming Soon",
    badgeColor: "yellow",
  },
];

export default function AdminPage() {
  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <VStack align="stretch" spacing={8}>
          <Box>
            <Heading size="2xl" mb={2}>
              Administration
            </Heading>
            <Text color="gray.600">Manage your Century 360° system from one central location</Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {adminModules.map(module => (
              <ChakraLink
                key={module.href}
                as={NextLink}
                href={module.href}
                _hover={{ textDecoration: "none" }}
              >
                <Card
                  h="full"
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                    borderColor: "blue.200",
                  }}
                  cursor="pointer"
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <Box p={3} bg="blue.50" borderRadius="lg" color="blue.600">
                          <Icon as={module.icon} boxSize={6} />
                        </Box>
                        <Badge colorScheme={module.badgeColor} variant="subtle">
                          {module.badge}
                        </Badge>
                      </HStack>
                      <Box>
                        <Heading size="md" mb={1}>
                          {module.title}
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                          {module.description}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </ChakraLink>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
