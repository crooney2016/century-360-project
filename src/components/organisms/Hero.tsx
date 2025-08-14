"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Box, Container, Heading, Text, HStack, Button } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { heroEntrance, heroTextStagger, heroTextItem, buttonHover } from "../../lib/animations";

export function Hero() {
  return (
    <motion.div variants={heroEntrance} initial="hidden" animate="visible">
      <Box as="section" py={16}>
        <Container maxW="2xl">
          <motion.div variants={heroTextStagger} initial="hidden" animate="visible">
            <motion.div variants={heroTextItem}>
              <Heading as="h1" size="2xl" fontWeight="semibold" letterSpacing="tight">
                Faster assisted order entry. Lower oversell risk.
              </Heading>
            </motion.div>

            <motion.div variants={heroTextItem}>
              <Text mt={3} color="gray.600" fontSize="lg">
                Keyboard-first variant matrix, explainable quote/submit, and crisp
                observability—built for enterprise.
              </Text>
            </motion.div>

            <motion.div variants={heroTextItem}>
              <HStack mt={6} gap={3}>
                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    size="lg"
                    colorScheme="blue"
                    leftIcon={<FiArrowRight />}
                    onClick={() => (window.location.href = "/catalog")}
                  >
                    Browse Catalog
                  </Button>
                </motion.div>

                <motion.div
                  variants={buttonHover}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    as={Link}
                    href="/dev/seed-status"
                    variant="outline"
                    size="lg"
                    _hover={{ bg: "gray.100" }}
                  >
                    Verify Seed
                  </Button>
                </motion.div>
              </HStack>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
}
