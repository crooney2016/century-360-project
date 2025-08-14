"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@chakra-ui/react";
import { buttonHover } from "../../lib/animations";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function AnimatedButton({ children, variant = "primary", ...props }: AnimatedButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bg: "blue.500",
          color: "white",
          _hover: { bg: "blue.600" },
          _active: { bg: "blue.700" },
        };
      case "secondary":
        return {
          bg: "gray.500",
          color: "white",
          _hover: { bg: "gray.600" },
          _active: { bg: "gray.700" },
        };
      case "outline":
        return {
          bg: "transparent",
          border: "1px solid",
          borderColor: "blue.500",
          color: "blue.500",
          _hover: { bg: "blue.50" },
          _active: { bg: "blue.100" },
        };
      case "ghost":
        return {
          bg: "transparent",
          color: "gray.600",
          _hover: { bg: "gray.100" },
          _active: { bg: "gray.200" },
        };
      default:
        return {};
    }
  };

  return (
    <motion.div variants={buttonHover} initial="initial" whileHover="hover" whileTap="tap">
      <Button {...getVariantStyles()} transition="all 0.2s ease" {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
