"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";

export default function UIShowcasePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="2xl" mb={2}>
            UI Components
          </Heading>
          <Text color="gray.600">Component showcase using Chakra UI v2</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontWeight="medium">Buttons</Text>
                <HStack spacing={2}>
                  <Button>Primary</Button>
                  <Button variant="outline">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="subtle">Subtle</Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontWeight="medium">Inputs</Text>
                <Input placeholder="Enter text..." />
                <Input placeholder="Disabled input" disabled />
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontWeight="medium">Badges</Text>
                <HStack spacing={2}>
                  <Badge>Default</Badge>
                  <Badge colorScheme="green">Success</Badge>
                  <Badge colorScheme="red">Error</Badge>
                  <Badge colorScheme="blue">Info</Badge>
                  <Badge colorScheme="orange">Warning</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Text fontWeight="medium">Card Variants</Text>
                <Text fontSize="sm" color="gray.600">
                  This card uses the default variant. Cards can have elevated, outline, or subtle
                  variants.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card variant="elevated">
          <CardHeader>
            <Heading size="md">Elevated Card</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              This is an elevated card with a header. It has a subtle shadow to lift it off the
              page.
            </Text>
          </CardBody>
          <CardFooter>
            <HStack spacing={2}>
              <Button size="sm">Action</Button>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </VStack>
    </Container>
  );
}
