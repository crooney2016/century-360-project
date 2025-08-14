"use client";

import { HStack, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { CenturyLogo } from "./CenturyLogo";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { useFullscreen } from "@/contexts/FullscreenContext";

/** Reusable Century 360° logo with icon and text. */
export function Logo({
  style,
  showText = true,
  size = "md",
  showFullscreenToggle = false,
}: {
  style?: React.CSSProperties;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  showFullscreenToggle?: boolean;
}) {
  // Always call the hook, but only use values when needed
  const fullscreenContext = useFullscreen();
  const isFullscreen = fullscreenContext?.isFullscreen || false;
  const toggleFullscreen = fullscreenContext?.toggleFullscreen || (() => {});

  const iconSizes = {
    sm: "6",
    md: "8",
    lg: "10",
  };

  const textSizes = {
    sm: "md",
    md: "xl",
    lg: "2xl",
  };

  return (
    <HStack
      gap={2}
      style={style}
      cursor="pointer"
      onClick={() => (window.location.href = "/")}
      p={2}
      borderRadius="lg"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        bg: "rgba(0, 0, 0, 0.02)",
        transform: "scale(1.02)",
      }}
    >
      <CenturyLogo w={iconSizes[size]} h={iconSizes[size]} color="blue.600" />
      {showText && (
        <Text fontWeight="bold" fontSize={textSizes[size]} letterSpacing="tight">
          Century
          <Text as="span" color="blue.600" fontWeight="extrabold">
            360°
          </Text>
        </Text>
      )}
      {showFullscreenToggle && (
        <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <IconButton
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: "rgba(0, 0, 0, 0.05)",
              transform: "scale(1.1)",
            }}
            borderRadius="md"
          >
            {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </IconButton>
        </Tooltip>
      )}
    </HStack>
  );
}
