"use client";

import { TopNavbar } from "@/components/layout/TopNavbar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { motion } from "framer-motion";
import { Box, Heading, Text, SimpleGrid, Card, CardBody, VStack } from "@chakra-ui/react";
import { FiPackage, FiTrendingUp, FiHome, FiBarChart2 } from "react-icons/fi";
import {
  glassEntrance,
  cardGridEntrance,
  cardEntrance,
  navEntrance,
  buttonHover,
} from "@/lib/animations";

export default function HomePage() {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
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
        bg="radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)"
        animation="float 20s ease-in-out infinite"
      />
      <Box
        position="absolute"
        top="20%"
        right="-20%"
        width="60%"
        height="60%"
        bg="radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)"
        animation="float 15s ease-in-out infinite reverse"
      />

      <motion.div variants={navEntrance} initial="hidden" animate="visible">
        <TopNavbar />
      </motion.div>

      <motion.div
        variants={navEntrance}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <SidebarNav />
      </motion.div>

      {/* Main Content with Sidebar Offset */}
      <Box ml="280px" pt="80px" p={8} position="relative" zIndex={1}>
        <Box maxW="7xl" mx="auto">
          <motion.div
            variants={glassEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <VStack spacing={6} align="start" mb={12}>
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(20px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="24px"
                p={8}
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
              >
                <Heading size="lg" color="white" mb={4}>
                  Century Enterprise 360° Portal
                </Heading>
                <Text color="rgba(255, 255, 255, 0.8)" fontSize="lg">
                  Your comprehensive business management platform for martial arts excellence
                </Text>
              </Box>
            </VStack>
          </motion.div>

          <motion.div
            variants={cardGridEntrance}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              <motion.div variants={cardEntrance}>
                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="20px"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <CardBody textAlign="center" p={8}>
                      <Box
                        mb={6}
                        display="flex"
                        justifyContent="center"
                        bg="rgba(59, 130, 246, 0.2)"
                        borderRadius="full"
                        p={4}
                        width="fit-content"
                        mx="auto"
                      >
                        <FiPackage size={40} color="#60a5fa" />
                      </Box>
                      <Heading size="md" mb={3} color="white">
                        Products
                      </Heading>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                        Manage your product catalog
                      </Text>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={cardEntrance}>
                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="20px"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <CardBody textAlign="center" p={8}>
                      <Box
                        mb={6}
                        display="flex"
                        justifyContent="center"
                        bg="rgba(34, 197, 94, 0.2)"
                        borderRadius="full"
                        p={4}
                        width="fit-content"
                        mx="auto"
                      >
                        <FiTrendingUp size={40} color="#4ade80" />
                      </Box>
                      <Heading size="md" mb={3} color="white">
                        Analytics
                      </Heading>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                        View performance metrics
                      </Text>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={cardEntrance}>
                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="20px"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <CardBody textAlign="center" p={8}>
                      <Box
                        mb={6}
                        display="flex"
                        justifyContent="center"
                        bg="rgba(168, 85, 247, 0.2)"
                        borderRadius="full"
                        p={4}
                        width="fit-content"
                        mx="auto"
                      >
                        <FiHome size={40} color="#a78bfa" />
                      </Box>
                      <Heading size="md" mb={3} color="white">
                        Dashboard
                      </Heading>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                        Overview of your business
                      </Text>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={cardEntrance}>
                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="20px"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    <CardBody textAlign="center" p={8}>
                      <Box
                        mb={6}
                        display="flex"
                        justifyContent="center"
                        bg="rgba(251, 146, 60, 0.2)"
                        borderRadius="full"
                        p={4}
                        width="fit-content"
                        mx="auto"
                      >
                        <FiBarChart2 size={40} color="#fb923c" />
                      </Box>
                      <Heading size="md" mb={3} color="white">
                        Reports
                      </Heading>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                        Generate business reports
                      </Text>
                    </CardBody>
                  </Card>
                </motion.div>
              </motion.div>
            </SimpleGrid>
          </motion.div>
        </Box>
      </Box>

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
