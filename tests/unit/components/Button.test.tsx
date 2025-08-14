import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/lib/theme";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider theme={theme}>{children}</ChakraProvider>
);

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders with custom text", () => {
      render(<Button>Custom Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Custom Button" })).toBeInTheDocument();
    });

    it("renders with aria-label", () => {
      render(<Button aria-label="Accessible button">Click me</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Accessible button" })).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<Button className="custom-class">Click me</Button>, {
        wrapper: TestWrapper,
      });
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders solid variant by default", () => {
      const { container } = render(<Button>Click me</Button>, { wrapper: TestWrapper });
      const button = container.querySelector("button");
      expect(button).toHaveClass("chakra-button");
    });

    it("renders outline variant", () => {
      const { container } = render(<Button variant="outline">Click me</Button>, {
        wrapper: TestWrapper,
      });
      const button = container.querySelector("button");
      expect(button).toHaveClass("chakra-button");
    });

    it("renders ghost variant", () => {
      const { container } = render(<Button variant="ghost">Click me</Button>, {
        wrapper: TestWrapper,
      });
      const button = container.querySelector("button");
      expect(button).toHaveClass("chakra-button");
    });

    it("renders subtle variant", () => {
      const { container } = render(<Button variant="subtle">Click me</Button>, {
        wrapper: TestWrapper,
      });
      const button = container.querySelector("button");
      expect(button).toHaveClass("chakra-button");
    });
  });

  describe("Sizes", () => {
    it("renders sm size", () => {
      render(<Button size="sm">Small Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Small Button" })).toBeInTheDocument();
    });

    it("renders md size", () => {
      render(<Button size="md">Medium Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Medium Button" })).toBeInTheDocument();
    });

    it("renders lg size", () => {
      render(<Button size="lg">Large Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Large Button" })).toBeInTheDocument();
    });
  });

  describe("States", () => {
    it("renders disabled state", () => {
      render(<Button disabled>Disabled Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Disabled Button" })).toBeDisabled();
    });

    it("renders loading state", () => {
      render(<Button isLoading>Loading Button</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Loading Button" })).toBeInTheDocument();
    });

    it("renders loading state with spinner", () => {
      render(
        <Button isLoading loadingText="Loading...">
          Button
        </Button>,
        { wrapper: TestWrapper }
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>, { wrapper: TestWrapper });

      fireEvent.click(screen.getByRole("button", { name: "Click me" }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>,
        { wrapper: TestWrapper }
      );

      fireEvent.click(screen.getByRole("button", { name: "Click me" }));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles keyboard navigation", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>, { wrapper: TestWrapper });

      const button = screen.getByRole("button", { name: "Click me" });
      button.focus();
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      render(<Button>Click me</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Button aria-label="Submit form">Click me</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button", { name: "Submit form" })).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Button aria-describedby="description">Click me</Button>
          <div id="description">This button submits the form</div>
        </div>,
        { wrapper: TestWrapper }
      );
      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("supports tabindex", () => {
      render(<Button tabIndex={0}>Click me</Button>, { wrapper: TestWrapper });
      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Styling", () => {
    it("applies custom styles", () => {
      const { container } = render(
        <Button sx={{ backgroundColor: "red", color: "white" }}>Click me</Button>,
        { wrapper: TestWrapper }
      );
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });

    it("applies hover styles", () => {
      const { container } = render(<Button _hover={{ backgroundColor: "blue" }}>Click me</Button>, {
        wrapper: TestWrapper,
      });
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("renders with empty children", () => {
      render(<Button></Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with null children", () => {
      render(<Button>{null}</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with undefined children", () => {
      render(<Button>{undefined}</Button>, { wrapper: TestWrapper });
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("handles multiple onClick calls", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>, { wrapper: TestWrapper });

      const button = screen.getByRole("button", { name: "Click me" });
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
