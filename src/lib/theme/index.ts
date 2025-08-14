import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { theme as glassTheme } from "@saas-ui/theme-glass";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

const theme = extendTheme(
  {
    config,
    colors: {
      brand: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e",
      },
      // Keep our custom glass colors for specific use cases
      glass: {
        primary: "rgba(14, 165, 233, 0.1)",
        secondary: "rgba(14, 165, 233, 0.05)",
        backdrop: "rgba(255, 255, 255, 0.8)",
        dark: "rgba(17, 24, 39, 0.8)",
        border: "rgba(14, 165, 233, 0.2)",
        borderDark: "rgba(14, 165, 233, 0.15)",
      },
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
    styles: {
      global: {
        body: {
          bg: "gray.50",
          color: "gray.900",
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: "medium",
          borderRadius: "md",
          transition: "all 0.2s",
          _hover: {
            transform: "translateY(-1px)",
          },
        },
        variants: {
          solid: {
            bg: "brand.500",
            color: "white",
            _hover: {
              bg: "brand.600",
            },
          },
          outline: {
            border: "1px solid",
            borderColor: "brand.500",
            color: "brand.500",
            _hover: {
              bg: "brand.50",
            },
          },
          ghost: {
            color: "brand.500",
            _hover: {
              bg: "brand.50",
            },
          },
          glass: {
            bg: "glass.primary",
            border: "1px solid",
            borderColor: "glass.border",
            color: "brand.700",
            backdropFilter: "blur(20px)",
            _hover: {
              bg: "glass.secondary",
              borderColor: "glass.borderDark",
            },
          },
        },
        sizes: {
          sm: {
            px: 3,
            py: 2,
            fontSize: "sm",
          },
          md: {
            px: 4,
            py: 2,
            fontSize: "md",
          },
          lg: {
            px: 6,
            py: 3,
            fontSize: "lg",
          },
        },
      },
      Card: {
        baseStyle: {
          bg: "white",
          borderRadius: "lg",
          boxShadow: "md",
          border: "1px solid",
          borderColor: "gray.200",
        },
      },
      Badge: {
        baseStyle: {
          borderRadius: "full",
          fontSize: "xs",
          fontWeight: "medium",
          px: 2,
          py: 1,
        },
        variants: {
          subtle: {
            bg: "brand.50",
            color: "brand.700",
          },
          solid: {
            bg: "brand.500",
            color: "white",
          },
        },
      },
      Input: {
        baseStyle: {
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "md",
          px: 3,
          py: 2,
          fontSize: "md",
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          },
        },
      },
      Table: {
        baseStyle: {
          width: "100%",
          borderCollapse: "collapse",
        },
      },
    },
  },
  // Extend with the SaaS-UI Glass theme - this provides the glassmorphism effects
  glassTheme
);

export default theme;
