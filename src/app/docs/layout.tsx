import { Box, Container, Flex, VStack, Heading, Link } from "@chakra-ui/react";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="container.xl" py={8}>
      <Flex gap={8}>
        {/* Sidebar Navigation */}
        <Box w="300px" flexShrink={0}>
          <VStack align="stretch" gap={6} position="sticky" top={8}>
            <Box>
              <Heading size="md" mb={4}>
                Documentation
              </Heading>
              <VStack align="stretch" gap={2}>
                <Link href="/docs" color="blue.500" _hover={{ textDecoration: "underline" }}>
                  Overview
                </Link>
                <Link
                  href="/docs/chakra-ui"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Chakra UI Guidelines
                </Link>
                <Link
                  href="/docs/blazity"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Blazity Integration
                </Link>
                <Link
                  href="/docs/enterprise"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Enterprise Patterns
                </Link>
                <Link
                  href="/docs/project-tree"
                  color="blue.500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Project Tree
                </Link>
              </VStack>
            </Box>

            <Box>
              <Heading size="sm" mb={3}>
                Quick Links
              </Heading>
              <VStack align="stretch" gap={2}>
                <Link href="/docs/chakra-ui#component-usage" color="gray.600" fontSize="sm">
                  Component Usage
                </Link>
                <Link href="/docs/blazity#architecture" color="gray.600" fontSize="sm">
                  Architecture
                </Link>
                <Link href="/docs/enterprise#security" color="gray.600" fontSize="sm">
                  Security Patterns
                </Link>
              </VStack>
            </Box>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} minW={0}>
          {children}
        </Box>
      </Flex>
    </Container>
  );
}
