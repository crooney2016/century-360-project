"use client";

import {
  Box,
  Container,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  navEntrance,
  buttonHover,
  searchFocus,
  modalBackdrop,
  modalContent,
} from "../../lib/animations";

export function TopNavbar() {
  const [searchValue, setSearchValue] = useState("");
  const [quickCreateType, setQuickCreateType] = useState("");
  const [quickCreateTitle, setQuickCreateTitle] = useState("");
  const [quickCreateDescription, setQuickCreateDescription] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleQuickCreate = () => {
    if (!quickCreateType || !quickCreateTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a type and enter a title",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Created Successfully",
      description: `${quickCreateType} "${quickCreateTitle}" has been created`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setQuickCreateType("");
    setQuickCreateTitle("");
    setQuickCreateDescription("");
    onClose();
  };

  return (
    <>
      <motion.div variants={navEntrance} initial="hidden" animate="visible">
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
              {/* Left: Logo with App Name */}
              <motion.div
                variants={buttonHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
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
              </motion.div>

              {/* Center: Global Search */}
              <Box flex={1} maxW="2xl">
                <form onSubmit={handleSearch}>
                  <motion.div variants={searchFocus} initial="initial" whileFocus="focus">
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
                  </motion.div>
                </form>
              </Box>

              {/* Right: Quick Create Button */}
              <motion.div
                variants={buttonHover}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
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
              </motion.div>
            </HStack>
          </Container>
        </Box>
      </motion.div>

      {/* Quick Create Modal */}
      <AnimatePresence>
        {isOpen && (
          <Modal isOpen={isOpen} onClose={onClose} size="md">
            <motion.div variants={modalBackdrop} initial="hidden" animate="visible" exit="hidden">
              <ModalOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.4)" />
            </motion.div>

            <motion.div variants={modalContent} initial="hidden" animate="visible" exit="hidden">
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
                      <motion.div
                        variants={buttonHover}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button variant="ghost" onClick={onClose}>
                          Cancel
                        </Button>
                      </motion.div>

                      <motion.div
                        variants={buttonHover}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                      >
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
                      </motion.div>
                    </HStack>
                  </Box>
                </ModalBody>
              </ModalContent>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
