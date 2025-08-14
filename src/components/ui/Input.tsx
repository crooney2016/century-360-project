import React from "react";
import { Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

export type InputProps = ChakraInputProps & {
  asChild?: boolean; // Maintain Blazity API compatibility
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "outline", size = "md", ...props }, ref) => {
    return <ChakraInput ref={ref} variant={variant} size={size} {...props} />;
  }
);

Input.displayName = "Input";
export default Input;
