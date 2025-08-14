"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  /* IconButton, */
  useDisclosure,
  useToast,
  /* Divider, */
  /* Badge, */
  Card,
  CardBody,
  Heading,
  Icon,
  /* useColorMode, */
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiFileText,
  FiMessageSquare,
  FiGrid,
  FiLayers,
  FiBox,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

export function AppShell() {
  const [searchValue, setSearchValue] = useState("");
  const [quickCreateType, setQuickCreateType] = useState("");
  const [quickCreateTitle, setQuickCreateTitle] = useState("");
  const [quickCreateDescription, setQuickCreateDescription] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  // const { colorMode } = useColorMode(); // Reserved for theme-aware features

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleQuickCreate = () => {
    if (!quickCreateType || !quickCreateTitle) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Mock creation - replace with actual API call
    toast({
      title: "Item created successfully",
      description: `Created ${quickCreateType}: ${quickCreateTitle}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form
    setQuickCreateType("");
    setQuickCreateTitle("");
    setQuickCreateDescription("");
    onClose();
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Navigation */}
      <Box
        bg="glass.backdrop"
        borderBottom="1px solid"
        borderColor="glass.border"
        position="sticky"
        top={0}
        zIndex={100}
        boxShadow="0 4px 16px 0 rgba(14, 165, 233, 0.1)"
        backdropFilter="blur(20px)"
      >
        <Container maxW="container.2xl" py={4}>
          <HStack justify="space-between" spacing={8}>
            <Box>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="glass.dark"
                cursor="pointer"
                onClick={() => router.push("/")}
                _hover={{ color: "blue.600" }}
                transition="color 0.2s ease"
              >
                Century 360°
              </Text>
            </Box>
            <Box flex={1} maxW="2xl">
              <form onSubmit={handleSearch}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Box color="gray.400">
                      <FiSearch />
                    </Box>
                  </InputLeftElement>
                  <Input
                    placeholder="Search products, orders, customers, or anything..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    bg="glass.primary"
                    border="1px solid"
                    borderColor="glass.border"
                    borderRadius="lg"
                    _hover={{
                      borderColor: "glass.borderDark",
                      bg: "glass.secondary",
                    }}
                    _focus={{
                      borderColor: "blue.500",
                      bg: "white",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    }}
                    _dark={{
                      bg: "glass.dark",
                      borderColor: "rgba(14, 165, 233, 0.15)",
                      _focus: {
                        bg: "rgba(17, 24, 39, 0.95)",
                        borderColor: "blue.400",
                      },
                    }}
                  />
                </InputGroup>
              </form>
            </Box>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              variant="solid"
              onClick={onOpen}
              size="md"
              bg="blue.500"
              _hover={{
                bg: "blue.600",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              }}
              transition="all 0.2s ease"
            >
              Quick Create
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Main Content Area */}
      <HStack spacing={0} align="flex-start" minH="calc(100vh - 80px)">
        {/* Left Sidebar */}
        <Box
          w="280px"
          h="calc(100vh - 80px)"
          bg="glass.backdrop"
          borderRight="1px solid"
          borderColor="glass.border"
          backdropFilter="blur(20px)"
          overflowY="auto"
          position="sticky"
          top="80px"
        >
          <VStack spacing={0} align="stretch" p={6}>
            {/* Main Navigation */}
            <VStack spacing={2} align="stretch" mb={8}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                MAIN NAVIGATION
              </Text>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiHome />}
                onClick={() => router.push("/")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiPackage />}
                onClick={() => router.push("/catalog")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Products
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiUsers />}
                onClick={() => router.push("/orders")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Orders
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiBarChart2 />}
                onClick={() => router.push("/reports")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Reports
              </Button>
            </VStack>

            {/* Content 360 Module */}
            <VStack spacing={2} align="stretch" mb={8}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                CONTENT 360 MODULE
              </Text>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiGrid />}
                onClick={() => router.push("/content-360")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Content 360
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiLayers />}
                onClick={() => router.push("/page-builder")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Page Builder
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiBox />}
                onClick={() => router.push("/editor")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Editor
              </Button>
            </VStack>

            {/* Administration */}
            <VStack spacing={2} align="stretch" mb={8}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                ADMINISTRATION
              </Text>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiSettings />}
                onClick={() => router.push("/admin")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Admin Panel
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={<FiUser />}
                onClick={() => router.push("/profile")}
                _hover={{ bg: "glass.primary" }}
                _active={{ bg: "glass.secondary" }}
              >
                Profile
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={8}>
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>
                Welcome to Century 360
              </Heading>
              <Text color="gray.600">Your comprehensive business management platform</Text>
            </Box>

            {/* Quick Stats */}
            <HStack spacing={6} wrap="wrap">
              <Card>
                <CardBody>
                  <VStack spacing={2} align="center">
                    <Icon as={FiPackage} boxSize={8} color="blue.500" />
                    <Text fontSize="2xl" fontWeight="bold">
                      150
                    </Text>
                    <Text color="gray.600">Products</Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <VStack spacing={2} align="center">
                    <Icon as={FiUsers} boxSize={8} color="green.500" />
                    <Text fontSize="2xl" fontWeight="bold">
                      89
                    </Text>
                    <Text color="gray.600">Orders</Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <VStack spacing={2} align="center">
                    <Icon as={FiBarChart2} boxSize={8} color="purple.500" />
                    <Text fontSize="2xl" fontWeight="bold">
                      $12.5K
                    </Text>
                    <Text color="gray.600">Revenue</Text>
                  </VStack>
                </CardBody>
              </Card>
            </HStack>

            {/* Recent Activity */}
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Recent Activity</Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={FiPackage} color="blue.500" />
                        <Text>New product added: Premium Widget</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        2 hours ago
                      </Text>
                    </HStack>
                    <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={FiUsers} color="green.500" />
                        <Text>Order #1234 completed</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        4 hours ago
                      </Text>
                    </HStack>
                    <HStack justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <HStack spacing={3}>
                        <Icon as={FiBarChart2} color="purple.500" />
                        <Text>Monthly report generated</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        1 day ago
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </HStack>

      {/* Quick Create Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.4)" />
        <ModalContent
          bg="glass.backdrop"
          border="1px solid"
          borderColor="glass.border"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
        >
          <ModalHeader color="glass.dark">Quick Create</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box>
              <FormControl isRequired mb={4}>
                <FormLabel>Type</FormLabel>
                <Select
                  placeholder="Select type"
                  value={quickCreateType}
                  onChange={e => setQuickCreateType(e.target.value)}
                  bg="glass.primary"
                  borderColor="glass.border"
                  _hover={{ borderColor: "glass.borderDark" }}
                  _focus={{ borderColor: "blue.500", bg: "white" }}
                >
                  <option value="ticket">Support Ticket</option>
                  <option value="content">Content</option>
                  <option value="project">Project</option>
                  <option value="todo">To-Do</option>
                </Select>
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  placeholder="Enter title"
                  value={quickCreateTitle}
                  onChange={e => setQuickCreateTitle(e.target.value)}
                  bg="glass.primary"
                  borderColor="glass.border"
                  _hover={{ borderColor: "glass.borderDark" }}
                  _focus={{ borderColor: "blue.500", bg: "white" }}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter description (optional)"
                  value={quickCreateDescription}
                  onChange={e => setQuickCreateDescription(e.target.value)}
                  rows={3}
                  bg="glass.primary"
                  borderColor="glass.border"
                  _hover={{ borderColor: "glass.borderDark" }}
                  _focus={{ borderColor: "blue.500", bg: "white" }}
                />
              </FormControl>
              <HStack spacing={3} justify="flex-end">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleQuickCreate}
                  bg="blue.500"
                  _hover={{
                    bg: "blue.600",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  }}
                  transition="all 0.2s ease"
                >
                  Create
                </Button>
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
