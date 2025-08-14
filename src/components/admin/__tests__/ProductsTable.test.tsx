import { render, screen, waitFor } from "@/tests/utils/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductsTable from "../ProductsTable";

// Mock data
const mockProducts = [
  {
    id: "1",
    ItemNumber: "011",
    Name: "Double Wrap Solid Belt",
    Dept: "Belts",
    Class: "Solid",
    RetailPriceMin: 6.99,
    RetailPriceMax: 6.99,
    WholesalePriceMin: 3.49,
    WholesalePriceMax: 3.49,
  },
];

const mockDimensions = {
  departments: ["Belts", "Custom"],
  classes: ["Solid", "Custom Stock"],
  deptClasses: {
    Belts: ["Solid"],
    Custom: ["Custom Stock"],
  },
};

describe("ProductsTable", () => {
  beforeEach(() => {
    // Mock fetch responses
    const mockFetch = vi.mocked(global.fetch);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDimensions,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: mockProducts,
        total: 1,
        totalPages: 1,
      }),
    });
  });

  it("renders the products table with data", async () => {
    render(<ProductsTable />);

    // Check if table headers are rendered
    expect(screen.getByText("Item #")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Dept")).toBeInTheDocument();
    expect(screen.getByText("Class")).toBeInTheDocument();
    expect(screen.getByText("Retail")).toBeInTheDocument();
    expect(screen.getByText("Wholesale")).toBeInTheDocument();

    // Wait for data to load and check if product is displayed
    await waitFor(() => {
      expect(screen.getByText("011")).toBeInTheDocument();
      expect(screen.getByText("Double Wrap Solid Belt")).toBeInTheDocument();
      expect(screen.getByText("Belts")).toBeInTheDocument();
      expect(screen.getByText("Solid")).toBeInTheDocument();
    });
  });

  it("displays price ranges correctly", async () => {
    render(<ProductsTable />);

    await waitFor(() => {
      // Single price should display as $6.99, not $6.99 – $6.99
      expect(screen.getByText("$6.99")).toBeInTheDocument();
    });
  });

  it("shows search input and filters", () => {
    render(<ProductsTable />);

    expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Search input
    expect(screen.getByText(/Departments/)).toBeInTheDocument();
    expect(screen.getByText(/Classes/)).toBeInTheDocument();
  });
});
