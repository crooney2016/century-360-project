import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export interface CardProps extends BoxProps {
  variant?: "default" | "elevated" | "outline";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", ...props }, ref) => (
    <Box
      ref={ref}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      shadow="sm"
      {...(variant === "elevated" && {
        shadow: "lg",
        _hover: { shadow: "xl" },
      })}
      {...(variant === "outline" && {
        borderColor: "gray.200",
      })}
      {...props}
    >
      {children}
    </Box>
  )
);

export const CardHeader = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} p={6} pb={3} {...props}>
      {children}
    </Box>
  )
);

export const CardBody = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} p={6} {...props}>
      {children}
    </Box>
  )
);

export const CardFooter = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} p={6} pt={3} {...props}>
      {children}
    </Box>
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export default Card;
