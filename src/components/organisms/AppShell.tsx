"use client";

import { Box, Container, Text } from "@chakra-ui/react";
import { TopNavbar } from "../layout/TopNavbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      <TopNavbar />
      <Box as="main" flex={1}>
        <Container maxWidth="container.xl" py={8}>
          {children}
        </Container>
      </Box>
      <Box as="footer" borderTopWidth="1px" bg="white">
        <Container maxWidth="container.xl" py={4}>
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Century 360
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
