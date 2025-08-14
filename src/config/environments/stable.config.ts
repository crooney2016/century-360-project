/**
 * Stable Environment Configuration
 *
 * This configuration is used for the production-ready setup with:
 * - Chakra UI v3
 * - Custom enterprise components
 * - Stable, tested components
 */

export const stableConfig = {
  theme: "custom-glass-theme",
  components: "custom-enterprise",
  provider: "ChakraProvider",
  testPattern: "src/**/__tests__/*.test.tsx",
  excludePattern: "src/**/__tests__/beta/*.test.tsx",
  packages: {
    ui: "@chakra-ui/react",
    theme: "custom",
    forms: "react-hook-form",
    tables: "custom",
    auth: "custom",
  },
  features: {
    glassEffects: true,
    enterpriseComponents: true,
    customTheming: true,
    saasUIBeta: false,
  },
};

export type StableConfig = typeof stableConfig;
