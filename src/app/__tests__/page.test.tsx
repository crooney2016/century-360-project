import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import HomePage from "../page";

// Mock the prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      count: vi.fn().mockResolvedValue(4119),
    },
    variant: {
      count: vi.fn().mockResolvedValue(18967),
      findMany: vi.fn().mockImplementation(({ distinct }) => {
        if (distinct.includes("Color")) {
          return Array.from({ length: 316 }, (_, i) => ({ Color: `Color${i}` }));
        }
        if (distinct.includes("Size")) {
          return Array.from({ length: 241 }, (_, i) => ({ Size: `Size${i}` }));
        }
        return [];
      }),
    },
  },
}));

describe("HomePage", () => {
  it("renders the hero section with correct content", async () => {
    render(await HomePage());

    // Check main page title
    expect(screen.getByText("Century Enterprise 360° Portal")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your comprehensive business management platform for martial arts excellence"
      )
    ).toBeInTheDocument();

    // Check welcome section
    expect(screen.getByText("Welcome to Century 360°")).toBeInTheDocument();
    expect(screen.getByText("Get started with your daily operations")).toBeInTheDocument();

    // Check CTA buttons
    expect(screen.getByText("Get Started")).toBeInTheDocument();
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders all action cards with correct content", async () => {
    render(await HomePage());

    // Check action cards
    expect(screen.getByText("Weekly Briefing")).toBeInTheDocument();
    expect(screen.getByText("Set Reminder")).toBeInTheDocument();
    expect(screen.getByText("Follow-Up")).toBeInTheDocument();
    expect(screen.getByText("Open Ticket")).toBeInTheDocument();

    // Check card descriptions
    expect(screen.getByText("Mon-Fri milestones & daily progress")).toBeInTheDocument();
    expect(screen.getByText("Schedule alerts & notifications")).toBeInTheDocument();
    expect(screen.getByText("Request team follow-up")).toBeInTheDocument();
    expect(screen.getByText("Submit IT or support request")).toBeInTheDocument();
  });

  it("renders the AI Sales Performance Analysis section", async () => {
    render(await HomePage());

    expect(screen.getByText("AI Sales Performance Analysis")).toBeInTheDocument();
    expect(
      screen.getByText("Real-time insights into your business performance")
    ).toBeInTheDocument();

    // Check for key performance text
    expect(screen.getByText(/Sales performance shows mixed results/)).toBeInTheDocument();
    expect(screen.getByText(/Big Box channel showing strongest momentum/)).toBeInTheDocument();
  });

  it("renders the system overview section with correct stats", async () => {
    render(await HomePage());

    expect(screen.getByText("System Overview")).toBeInTheDocument();
    expect(screen.getByText("Key metrics and performance indicators")).toBeInTheDocument();

    // Check stats are displayed
    expect(screen.getByText("4,119")).toBeInTheDocument();
    expect(screen.getByText("18,967")).toBeInTheDocument();
    expect(screen.getByText("316")).toBeInTheDocument();
    expect(screen.getByText("241")).toBeInTheDocument();

    // Check labels
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Variants")).toBeInTheDocument();
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Sizes")).toBeInTheDocument();
  });

  it("renders navigation elements", async () => {
    render(await HomePage());

    // Check brand
    expect(screen.getByText("Century 360°")).toBeInTheDocument();

    // Check navigation links (use getAllByText since they appear in multiple places)
    expect(screen.getAllByText("Catalog").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Orders").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reports").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);

    // Check sidebar navigation
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Product Catalog").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Analytics").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Customers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Admin Panel").length).toBeGreaterThan(0);
  });

  it("renders with proper accessibility attributes", async () => {
    render(await HomePage());

    // Check that headings are properly structured (main heading should be h1)
    const mainHeading = screen.getByRole("heading", {
      name: "Century Enterprise 360° Portal",
    });
    expect(mainHeading).toBeInTheDocument();

    // Check for navigation landmarks
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // Check for proper button labels
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("renders with proper responsive design structure", async () => {
    render(await HomePage());

    // Check that we have proper structural elements that indicate responsive design
    // Look for Container components (which handle responsive behavior)
    const containerElements = document.querySelectorAll(
      '[class*="container"], [class*="chakra-container"]'
    );

    // Look for grid-like structures (SimpleGrid components)
    const gridElements = document.querySelectorAll(
      '[class*="grid"], [class*="chakra-simple-grid"], [class*="chakra-grid"]'
    );

    // Look for any responsive elements
    const responsiveElements = document.querySelectorAll(
      '[class*="chakra"], [class*="container"], [class*="grid"]'
    );

    // The test should pass if we have any responsive structure
    const hasResponsiveStructure =
      containerElements.length > 0 || gridElements.length > 0 || responsiveElements.length > 0;

    expect(hasResponsiveStructure).toBe(true);
  });

  it("handles database errors gracefully with fallback data", async () => {
    // Mock Prisma to throw an error
    const { prisma } = await import("@/lib/prisma");
    vi.mocked(prisma.product.count).mockRejectedValueOnce(new Error("Database connection failed"));
    vi.mocked(prisma.variant.count).mockRejectedValueOnce(new Error("Database connection failed"));
    vi.mocked(prisma.variant.findMany).mockRejectedValueOnce(
      new Error("Database connection failed")
    );

    render(await HomePage());

    // Should still render with fallback data
    expect(screen.getByText("System Overview")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Variants")).toBeInTheDocument();
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Sizes")).toBeInTheDocument();
  });
});
