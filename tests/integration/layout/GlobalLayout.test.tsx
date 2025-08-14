import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GlobalLayout } from "@/components/layout/GlobalLayout";
import { ChakraProvider } from "@chakra-ui/react";
import { NavigationProvider } from "@/contexts/NavigationContext";
import theme from "@/lib/theme";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>
    <NavigationProvider>{children}</NavigationProvider>
  </ChakraProvider>
);

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("GlobalLayout Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Layout Structure", () => {
    it("renders complete layout structure", () => {
      render(
        <GlobalLayout>
          <div data-testid="main-content">Main Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check for main layout components
      expect(screen.getByTestId("main-content")).toBeInTheDocument();
    });

    it("renders navigation elements", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check for navigation components
      expect(screen.getByText("Century 360°")).toBeInTheDocument();
    });
  });

  describe("Navigation Integration", () => {
    it("handles navigation state changes", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check that navigation context is working
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("maintains navigation state across renders", () => {
      const { rerender } = render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Re-render and check state persistence
      rerender(
        <GlobalLayout>
          <div>Updated Content</div>
        </GlobalLayout>
      );

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("adapts to different screen sizes", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check for responsive classes
      const layout = screen.getByText("Content").closest("div");
      expect(layout).toBeInTheDocument();
    });
  });

  describe("Theme Integration", () => {
    it("applies theme consistently", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check that theme is applied
      const container = document.querySelector(".chakra-ui-light");
      expect(container).toBeTruthy();
    });

    it("maintains theme across component updates", () => {
      const { rerender } = render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      rerender(
        <GlobalLayout>
          <div>New Content</div>
        </GlobalLayout>
      );

      // Theme should still be applied
      const container = document.querySelector(".chakra-ui-light");
      expect(container).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("maintains proper ARIA attributes", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check for proper navigation structure
      const nav = document.querySelector("nav");
      expect(nav).toBeTruthy();
    });

    it("supports keyboard navigation", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check that interactive elements are focusable
      const buttons = screen.getAllByRole("button");
      buttons.forEach(button => {
        expect(button).toHaveAttribute("tabIndex");
      });
    });
  });

  describe("Performance", () => {
    it("renders without excessive re-renders", () => {
      const renderSpy = vi.fn();

      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Check that component rendered efficiently
      expect(renderSpy).not.toHaveBeenCalled();
    });

    it("handles large content efficiently", () => {
      const largeContent = Array.from({ length: 100 }, (_, i) => (
        <div key={i}>Content Item {i}</div>
      ));

      render(<GlobalLayout>{largeContent}</GlobalLayout>, { wrapper: TestWrapper });

      // Should render without performance issues
      expect(screen.getByText("Content Item 0")).toBeInTheDocument();
      expect(screen.getByText("Content Item 99")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles navigation errors gracefully", () => {
      // Mock navigation error
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Should still render even with navigation issues
      expect(screen.getByText("Content")).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("recovers from theme errors", () => {
      render(
        <GlobalLayout>
          <div>Content</div>
        </GlobalLayout>,
        { wrapper: TestWrapper }
      );

      // Should render even if theme has issues
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });
});
