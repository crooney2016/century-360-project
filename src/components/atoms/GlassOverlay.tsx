/**
 * GlassOverlay - A beautiful glass morphism overlay component
 * Uses Chakra UI v3 design tokens for consistent theming
 * Implements glass frosty theme with enterprise SaaS styling
 */

import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export interface GlassOverlayProps extends Omit<BoxProps, "backdropBlur"> {
  /** Glass effect intensity */
  intensity?: "light" | "medium" | "strong";
  /** Whether to show backdrop blur */
  backdropBlur?: boolean;
  /** Custom background color */
  bgColor?: string;
  /** Children content */
  children: React.ReactNode;
}

export const GlassOverlay: React.FC<GlassOverlayProps> = ({
  intensity = "medium",
  backdropBlur = true,
  bgColor,
  children,
  ...props
}) => {
  const glassStyles = {
    light: {
      bg: "glass.primary",
      borderColor: "glass.border",
      boxShadow: "0 4px 16px 0 rgba(14, 165, 233, 0.1)",
    },
    medium: {
      bg: "glass.secondary",
      borderColor: "glass.borderDark",
      boxShadow: "0 8px 32px 0 rgba(14, 165, 233, 0.15)",
    },
    strong: {
      bg: "rgba(14, 165, 233, 0.2)",
      borderColor: "rgba(14, 165, 233, 0.3)",
      boxShadow: "0 12px 48px 0 rgba(14, 165, 233, 0.25)",
    },
  };

  const darkGlassStyles = {
    light: {
      bg: "glass.dark",
      borderColor: "rgba(14, 165, 233, 0.1)",
      boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.2)",
    },
    medium: {
      bg: "rgba(17, 24, 39, 0.9)",
      borderColor: "rgba(14, 165, 233, 0.15)",
      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    },
    strong: {
      bg: "rgba(17, 24, 39, 0.95)",
      borderColor: "rgba(14, 165, 233, 0.2)",
      boxShadow: "0 12px 48px 0 rgba(0, 0, 0, 0.5)",
    },
  };

  const style = glassStyles[intensity];
  const darkStyle = darkGlassStyles[intensity];

  return (
    <Box
      border="1px solid"
      borderRadius="xl"
      style={{
        backdropFilter: backdropBlur ? "blur(20px)" : "none",
        ...style,
        ...(bgColor && { background: bgColor }),
      }}
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow:
          intensity === "light"
            ? "0 8px 32px 0 rgba(14, 165, 233, 0.2)"
            : intensity === "medium"
              ? "0 12px 48px 0 rgba(14, 165, 233, 0.25)"
              : "0 16px 64px 0 rgba(14, 165, 233, 0.35)",
      }}
      _dark={{
        ...darkStyle,
        ...(bgColor && { background: bgColor }),
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default GlassOverlay;
