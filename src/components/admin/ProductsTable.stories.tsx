import type { Meta, StoryObj } from "@storybook/react";
import ProductsTable from "./ProductsTable";

// Mock data for stories
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
  {
    id: "2",
    ItemNumber: "0110",
    Name: "Single Wrap Solid Belt",
    Dept: "Belts",
    Class: "Solid",
    RetailPriceMin: 5.99,
    RetailPriceMax: 5.99,
    WholesalePriceMin: 2.99,
    WholesalePriceMax: 2.99,
  },
  {
    id: "3",
    ItemNumber: "01101",
    Name: "COLOR BELT White-ATA",
    Dept: "Belts",
    Class: "Custom Stock",
    RetailPriceMin: 4.99,
    RetailPriceMax: 4.99,
    WholesalePriceMin: 1.99,
    WholesalePriceMax: 1.99,
  },
];

const mockDimensions = {
  departments: ["Belts", "Custom", "Uniforms"],
  classes: ["Solid", "Custom Stock", "Black Belts", "Uniforms"],
  deptClasses: {
    Belts: ["Solid", "Custom Stock", "Black Belts"],
    Custom: ["Custom Stock"],
    Uniforms: ["Uniforms"],
  },
};

const meta: Meta<typeof ProductsTable> = {
  title: "Admin/ProductsTable",
  component: ProductsTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Admin products table with search, filtering, and pagination capabilities. Supports department and class filtering with cross-filtering logic.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="min-h-screen bg-gray-50 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    mockData: {
      products: mockProducts,
      dimensions: mockDimensions,
    },
  },
};

export const WithSearchResults: Story = {
  args: {},
  parameters: {
    mockData: {
      products: mockProducts.filter(p => p.Name.toLowerCase().includes("belt")),
      dimensions: mockDimensions,
    },
  },
};

export const EmptyState: Story = {
  args: {},
  parameters: {
    mockData: {
      products: [],
      dimensions: mockDimensions,
    },
  },
};

export const LoadingState: Story = {
  args: {},
  parameters: {
    mockData: {
      products: [],
      dimensions: null,
    },
  },
};

export const WithFilters: Story = {
  args: {},
  parameters: {
    mockData: {
      products: mockProducts.filter(p => p.Dept === "Belts"),
      dimensions: mockDimensions,
    },
  },
};
