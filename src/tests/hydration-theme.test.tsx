import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/lib/theme";
import { NavigationProvider } from "@/contexts/NavigationContext";
import HomePage from "@/app/page";

// Mock Prisma for consistent testing
vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      count: vi.fn().mockResolvedValue(100),
    },
    variant: {
      count: vi.fn().mockResolvedValue(500),
      findMany: vi.fn().mockImplementation(({ distinct }) => {
        if (distinct.includes("Color")) {
          return Array.from({ length: 10 }, (_, i) => ({ Color: `Color${i}` }));
        }
        if (distinct.includes("Size")) {
          return Array.from({ length: 8 }, (_, i) => ({ Size: `Size${i}` }));
        }
        return [];
      }),
    },
  },
}));

// Test wrapper that mimics the actual app structure
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <NavigationProvider>{children}</NavigationProvider>
  </ChakraProvider>
);

describe("Hydration & Theme Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Theme Configuration", () => {
    it("should have consistent theme configuration", () => {
      expect(theme.config.initialColorMode).toBe("light");
      expect(theme.config.useSystemColorMode).toBe(false);
      expect(theme.colors.brand).toBeDefined();
      expect(theme.components.Button).toBeDefined();
      expect(theme.components.Card).toBeDefined();
    });

    it("should have proper color mode configuration", () => {
      expect(theme.config.initialColorMode).toBe("light");
      expect(typeof theme.config.initialColorMode).toBe("string");
    });

    it("should have consistent component styling", () => {
      expect(theme.components.Button.baseStyle).toBeDefined();
      expect(theme.components.Card.baseStyle).toBeDefined();
      expect(theme.components.Badge.baseStyle).toBeDefined();
    });
  });

  describe("ChakraProvider Setup", () => {
    it("should render without hydration warnings", async () => {
      const consoleSpy = vi.spyOn(console, "error");

      render(await HomePage(), { wrapper: TestWrapper });

      // Check that no hydration errors were logged
      const hydrationErrors = consoleSpy.mock.calls.filter(
        call =>
          call[0]?.includes?.("hydration") ||
          call[0]?.includes?.("Hydration") ||
          call[0]?.includes?.("mismatch")
      );

      expect(hydrationErrors).toHaveLength(0);
      consoleSpy.mockRestore();
    });

    it("should maintain consistent theme attributes", async () => {
      const { container } = render(await HomePage(), { wrapper: TestWrapper });

      // Check that theme-related attributes are consistent
      const rootElement = container.firstChild;
      const navElement = container.querySelector("nav");

      // These should not cause hydration mismatches
      expect(rootElement).toBeTruthy();
      expect(navElement).toBeTruthy();
    });
  });

  describe("Component Rendering Consistency", () => {
    it("should render all major components without errors", async () => {
      const { container } = render(await HomePage(), { wrapper: TestWrapper });

      // Check for critical components
      expect(screen.getByText("Century 360°")).toBeInTheDocument();
      expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Variants")).toBeInTheDocument();

      // Check for proper HTML structure
      expect(container.querySelector("nav")).toBeTruthy();
      // Check for any element with flex or padding classes
      const hasLayout =
        container.querySelector("[class*='flex']") ||
        container.querySelector("[class*='p-']") ||
        container.querySelector("[class*='min-h']");
      expect(hasLayout).toBeTruthy();
    });

    it("should maintain consistent spacing and layout", async () => {
      render(await HomePage(), { wrapper: TestWrapper });

      // Check that layout components are properly rendered
      expect(screen.getByText("Century Enterprise 360° Portal")).toBeInTheDocument();
    });
  });

  describe("Navigation Context", () => {
    it("should provide navigation context without errors", async () => {
      render(await HomePage(), { wrapper: TestWrapper });

      // Check that navigation elements are properly rendered
      expect(screen.getByText("Catalog")).toBeInTheDocument();
      expect(screen.getAllByText("Orders").length).toBeGreaterThan(0);
      expect(screen.getByText("Reports")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    it("should handle navigation state properly", async () => {
      render(await HomePage(), { wrapper: TestWrapper });

      // Check that navigation buttons are properly configured
      expect(screen.getByText("Catalog")).toBeInTheDocument();
      expect(screen.getByText("Orders")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });

  describe("Database Integration", () => {
    it("should handle database calls gracefully", async () => {
      render(await HomePage(), { wrapper: TestWrapper });

      // Check that stats are displayed
      expect(screen.getByText("100")).toBeInTheDocument(); // Products count
      expect(screen.getByText("500")).toBeInTheDocument(); // Variants count
      expect(screen.getByText("10")).toBeInTheDocument(); // Colors count
      expect(screen.getByText("8")).toBeInTheDocument(); // Sizes count
    });

    it("should handle database errors gracefully", async () => {
      // Mock database error
      const { prisma } = await import("@/lib/prisma");
      vi.mocked(prisma.product.count).mockRejectedValueOnce(new Error("DB Error"));
      vi.mocked(prisma.variant.count).mockRejectedValueOnce(new Error("DB Error"));
      vi.mocked(prisma.variant.findMany).mockRejectedValueOnce(new Error("DB Error"));

      render(await HomePage(), { wrapper: TestWrapper });

      // Should still render with fallback data
      expect(screen.getByText("System Overview")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Variants")).toBeInTheDocument();
    });
  });

  describe("Accessibility & Semantic HTML", () => {
    it("should maintain proper semantic structure", async () => {
      const { container } = render(await HomePage(), { wrapper: TestWrapper });

      // Check for proper heading hierarchy
      const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper navigation structure
      const nav = container.querySelector("nav");
      expect(nav).toBeTruthy();

      // Check for proper button accessibility
      const buttons = container.querySelectorAll("button");
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute("aria-label");
        // Buttons should have either aria-label or meaningful text content
        expect(ariaLabel || button.textContent?.trim()).toBeTruthy();
      });
    });
  });
});
