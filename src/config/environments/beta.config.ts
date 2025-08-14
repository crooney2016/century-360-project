/**
 * Beta Environment Configuration
 *
 * This configuration is used for SaaS UI v3 beta testing with:
 * - Chakra UI v3
 * - SaaS UI v3 beta components
 * - Experimental features
 */

export const betaConfig = {
  theme: "saas-ui-glass-theme",
  components: "saas-ui-v3-beta",
  provider: "SaasProvider",
  testPattern: "src/**/__tests__/beta/*.test.tsx",
  excludePattern: "src/**/__tests__/*.test.tsx",
  packages: {
    ui: "@saas-ui/react",
    theme: "@saas-ui/theme-glass",
    forms: "@saas-ui/forms",
    tables: "@saas-ui/data-table",
    auth: "@saas-ui/react",
  },
  features: {
    glassEffects: true,
    enterpriseComponents: true,
    customTheming: false,
    saasUIBeta: true,
  },
};

export type BetaConfig = typeof betaConfig;
