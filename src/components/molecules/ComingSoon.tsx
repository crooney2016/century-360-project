"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Badge,
  Container,
  List,
  CardBody,
  ListItem,
} from "@chakra-ui/react";
import { FiArrowLeft, FiHome, FiCheckSquare } from "react-icons/fi";

/**
 * A "Coming Soon" component that displays work-in-progress status with todos
 * and provides safe navigation to prevent users from getting stuck.
 *
 * @remarks
 * This component shows development status and next steps while ensuring
 * users always have a way back without browser controls.
 *
 * @example
 * ```tsx
 * <ComingSoon
 *   title="User Profile"
 *   description="We're building an amazing profile management experience."
 *   todos={["Create user avatar upload", "Build preferences panel", "Add security settings"]}
 *   fallbackRoute="/admin"
 * />
 * ```
 */
export interface ComingSoonProps {
  /** The title of the feature being developed */
  title: string;
  /** Optional description of what's coming */
  description?: string;
  /** List of todo items for this feature */
  todos?: string[];
  /** The route to navigate to if no browser history exists */
  fallbackRoute?: string;
  /** Optional custom message for the back button */
  backButtonText?: string;
}

export function ComingSoon({
  title,
  description = "This feature is currently under development. We'll have it ready soon!",
  todos = [],
  fallbackRoute = "/",
  backButtonText = "Go Back",
}: ComingSoonProps) {
  const router = useRouter();

  const handleGoBack = React.useCallback(() => {
    // Try to go back in browser history first
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Fallback to a safe route if no history
      router.push(fallbackRoute);
    }
  }, [router, fallbackRoute]);

  const handleGoHome = React.useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <Container
      maxWidth="container.lg"
      py={8}
      minH="calc(100vh - 65px)"
      display="flex"
      alignItems="center"
    >
      <Box w="full" display="flex" justifyContent="center">
        <Card maxW="2xl" w="full" shadow="xl">
          <CardBody p={8}>
            <VStack gap={8} textAlign="center">
              {/* Large Construction Icon */}
              <Box
                w={24}
                h={24}
                bg={{ base: "amber.100", _dark: "amber.900/30" }}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  inset: "-2px",
                  borderRadius: "full",
                  background: "linear-gradient(45deg, #f59e0b, #d97706, #92400e)",
                  zIndex: -1,
                  opacity: 0.1,
                }}
              >
                <Text fontSize="6xl" lineHeight={1}>
                  🚧
                </Text>
              </Box>

              {/* Status Badge */}
              <Badge colorScheme="amber" variant="subtle" fontSize="sm" px={2} py={1}>
                🚧 Work In Progress
              </Badge>

              {/* Content */}
              <VStack gap={3}>
                <Heading
                  size="2xl"
                  color={{ base: "gray.900", _dark: "gray.100" }}
                  fontWeight="bold"
                >
                  {title}
                </Heading>
                <Text
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  fontSize="lg"
                  maxWidth="md"
                  lineHeight="1.6"
                >
                  {description}
                </Text>
              </VStack>

              {/* Todo List */}
              {todos.length > 0 && (
                <Card w="full" bg={{ base: "gray.50", _dark: "gray.800" }}>
                  <CardBody p={6}>
                    <VStack gap={4} align="start">
                      <HStack gap={2}>
                        <Icon as={FiCheckSquare} color="blue.500" />
                        <Heading size="md" color={{ base: "gray.900", _dark: "gray.100" }}>
                          Implementation Roadmap
                        </Heading>
                      </HStack>
                      <List spacing={3}>
                        {todos.map((todo, index) => (
                          <ListItem key={index}>
                            <HStack gap={2}>
                              <Icon as={FiCheckSquare} color="gray.400" />
                              <Text fontSize="sm">{todo}</Text>
                            </HStack>
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Safe Navigation */}
              <HStack gap={4} w="full" justify="center">
                <Button onClick={handleGoBack} colorScheme="blue" size="lg">
                  <HStack gap={2}>
                    <Icon as={FiArrowLeft} />
                    <Text>{backButtonText}</Text>
                  </HStack>
                </Button>
                <Button onClick={handleGoHome} variant="outline" size="lg">
                  <HStack gap={2}>
                    <Icon as={FiHome} />
                    <Text>Homepage</Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
}
