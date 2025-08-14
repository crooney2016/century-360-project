"use client";

import { Box, VStack, HStack, IconButton, Heading, Text } from "@chakra-ui/react";
import { FiX, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { useNavigation } from "@/contexts/NavigationContext";
import { useState } from "react";

export function RightPanel() {
  const { rightPanelOpen, rightPanelContent, rightPanelTitle, closeRightPanel } = useNavigation();
  const [isMaximized, setIsMaximized] = useState(false);

  if (!rightPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {rightPanelOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.500"
          zIndex={1400}
          backdropFilter="blur(4px)"
          onClick={() => !isMaximized && closeRightPanel()}
        />
      )}

      {/* Panel */}
      <Box
        position="fixed"
        top="65px"
        right={0}
        bottom={0}
        w={isMaximized ? "100vw" : "min(90vw, 600px)"}
        bg={{ base: "white", _dark: "gray.900" }}
        boxShadow="2xl"
        zIndex={1500}
        borderLeft="1px"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        transform={rightPanelOpen ? "translateX(0)" : "translateX(100%)"}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <HStack
          p={4}
          borderBottom="1px"
          borderColor={{ base: "gray.200", _dark: "gray.700" }}
          justify="space-between"
        >
          <Heading size="md" color={{ base: "gray.900", _dark: "gray.100" }}>
            {rightPanelTitle}
          </Heading>
          <HStack>
            <IconButton
              aria-label={isMaximized ? "Minimize" : "Maximize"}
              size="sm"
              variant="ghost"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
            </IconButton>
            <IconButton
              aria-label="Close panel"
              size="sm"
              variant="ghost"
              onClick={closeRightPanel}
            >
              <FiX />
            </IconButton>
          </HStack>
        </HStack>

        {/* Content */}
        <Box flex="1" overflow="auto" p={4}>
          {rightPanelContent || (
            <VStack gap={4} align="start">
              <Text color={{ base: "gray.600", _dark: "gray.400" }}>
                Right panel content will appear here.
              </Text>
            </VStack>
          )}
        </Box>
      </Box>
    </>
  );
}
