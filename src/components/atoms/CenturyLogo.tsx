"use client";

import { Box, type BoxProps } from "@chakra-ui/react";

export function CenturyLogo(props: BoxProps) {
  return (
    <Box as="svg" viewBox="0 0 100 100" fill="currentColor" {...props}>
      <Box as="path" d="M50 10 L80 30 L80 50 L50 70 L20 50 L20 30 Z" fill="currentColor" />
      <Box as="path" d="M35 40 L35 60 L65 40 Z" fill="white" />
    </Box>
  );
}

// Favicon version with blue color
export function CenturyLogoFavicon(props: BoxProps) {
  return (
    <Box as="svg" viewBox="0 0 100 100" {...props}>
      <Box as="rect" width="100" height="100" fill="#3B82F6" />
      <Box as="path" d="M50 15 L75 30 L75 45 L50 60 L25 45 L25 30 Z" fill="white" />
      <Box as="path" d="M40 37 L40 52 L60 37 Z" fill="#3B82F6" />
    </Box>
  );
}
