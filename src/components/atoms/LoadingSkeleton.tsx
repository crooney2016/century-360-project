"use client";

import { motion } from "framer-motion";
import { Box, VStack, HStack } from "@chakra-ui/react";

interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
  width?: string;
  spacing?: number;
}

export function LoadingSkeleton({
  rows = 3,
  height = "60px",
  width = "100%",
  spacing = 3,
}: LoadingSkeletonProps) {
  return (
    <VStack spacing={spacing} align="stretch">
      {[...Array(rows)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Box
            h={height}
            w={width}
            bg="gray.200"
            borderRadius="md"
            position="relative"
            overflow="hidden"
          >
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          </Box>
        </motion.div>
      ))}
    </VStack>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      <HStack spacing={4} flexWrap="wrap">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <Box
              w="200px"
              h="120px"
              bg="gray.200"
              borderRadius="md"
              position="relative"
              overflow="hidden"
            >
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
              />
            </Box>
          </motion.div>
        ))}
      </HStack>
    </motion.div>
  );
}
