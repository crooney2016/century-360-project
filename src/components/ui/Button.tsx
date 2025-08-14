import React from "react";
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from "@chakra-ui/react";

export type ButtonProps = ChakraButtonProps & {
  asChild?: boolean; // Maintain Blazity API compatibility
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", colorScheme = "brand", ...props }, ref) => {
    return (
      <ChakraButton ref={ref} variant={variant} size={size} colorScheme={colorScheme} {...props} />
    );
  }
);

Button.displayName = "Button";
export default Button;
