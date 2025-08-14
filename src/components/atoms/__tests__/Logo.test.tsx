import { render, screen } from "@/tests/utils/test-utils";
import { describe, it, expect } from "vitest";

// Simple test component to verify test infrastructure
const SimpleTestComponent = () => (
  <div>
    <h1>Test Component</h1>
    <p>This is a test</p>
  </div>
);

describe("Test Infrastructure", () => {
  it("renders simple component correctly", () => {
    render(<SimpleTestComponent />);

    expect(screen.getByText("Test Component")).toBeInTheDocument();
    expect(screen.getByText("This is a test")).toBeInTheDocument();
  });

  it("can find elements by text content", () => {
    render(<SimpleTestComponent />);

    const heading = screen.getByRole("heading", { name: "Test Component" });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });
});
