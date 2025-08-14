import React from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  SimpleGrid,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Layout, Grid, FileText, Users, BarChart3, Image, Link2, Settings } from "lucide-react";
import { CustomerCard } from "./CustomerCard";
import { getCustomers } from "../../data/customers";
import { ComponentGalleryClient } from "./ComponentGalleryClient";

export interface ComponentExample {
  id: string;
  name: string;
  description: string;
  category: "layout" | "content" | "data" | "media" | "forms" | "navigation";
  icon: React.ComponentType<Record<string, unknown>>;
  preview: React.ReactNode;
  props: Record<string, unknown>;
  usage: string;
  tags: string[];
  // New properties for user interaction
  isDraggable?: boolean;
  defaultProps?: Record<string, unknown>;
  configurableProps?: string[];
}

const componentExamples: ComponentExample[] = [
  {
    id: "hero-section",
    name: "Hero Section",
    description: "Large banner section for page headers and announcements",
    category: "layout",
    icon: Layout,
    preview: (
      <Box bg="blue.500" color="white" p={8} textAlign="center" borderRadius="lg">
        <VStack spacing={4}>
          <Heading size="2xl">Hero Section</Heading>
          <Text fontSize="xl" opacity={0.9}>
            Perfect for page headers
          </Text>
        </VStack>
      </Box>
    ),
    props: {
      title: "Welcome to Century 360",
      subtitle: "Your comprehensive business platform",
      backgroundColor: "blue.500",
      textColor: "white",
      padding: 16,
    },
    defaultProps: {
      title: "Welcome to Century 360",
      subtitle: "Your comprehensive business platform",
      backgroundColor: "blue.500",
      textColor: "white",
      padding: 16,
    },
    configurableProps: ["title", "subtitle", "backgroundColor", "textColor", "padding"],
    usage: "Use for page headers, announcements, and key messaging",
    tags: ["header", "banner", "announcement"],
    isDraggable: true,
  },
  {
    id: "content-grid",
    name: "Content Grid",
    description: "Flexible grid layout for organizing content",
    category: "layout",
    icon: Grid,
    preview: (
      <SimpleGrid columns={3} spacing={4}>
        {[1, 2, 3].map(i => (
          <Box key={`content-${i}`} bg="gray.100" p={4} borderRadius="md" textAlign="center">
            Content {i}
          </Box>
        ))}
      </SimpleGrid>
    ),
    props: {
      columns: 3,
      spacing: 4,
      items: ["Content 1", "Content 2", "Content 3"],
    },
    defaultProps: {
      columns: 3,
      spacing: 4,
      items: ["Content 1", "Content 2", "Content 3"],
    },
    configurableProps: ["columns", "spacing", "items"],
    usage: "Organize content in responsive grid layouts",
    tags: ["grid", "layout", "responsive"],
    isDraggable: true,
  },
  {
    id: "text-block",
    name: "Text Block",
    description: "Rich text content with formatting options",
    category: "content",
    icon: FileText,
    preview: (
      <Box>
        <Heading size="md" mb={3}>
          Text Block
        </Heading>
        <Text>This is a sample text block with rich formatting capabilities.</Text>
      </Box>
    ),
    props: {
      text: "Sample text content",
      fontSize: "md",
      fontWeight: "normal",
      textAlign: "left",
      color: "gray.800",
    },
    defaultProps: {
      text: "Sample text content",
      fontSize: "md",
      fontWeight: "normal",
      textAlign: "left",
      color: "gray.800",
    },
    configurableProps: ["text", "fontSize", "fontWeight", "textAlign", "color"],
    usage: "Display formatted text content with various styling options",
    tags: ["text", "content", "typography"],
    isDraggable: true,
  },
  {
    id: "customer-card",
    name: "Customer Card",
    description: "Display individual customer information with search and selection",
    category: "data",
    icon: Users,
    preview: (
      <Box maxW="300px">
        <CustomerCard
          customer={getCustomers()[0]}
          displayMode="detailed"
          showContacts={true}
          showAddresses={false}
          showBusinessInfo={true}
          isEditable={true}
        />
      </Box>
    ),
    props: {
      customerId: "",
      displayMode: "detailed",
      showActionButtons: false,
      showBusinessInfo: true,
      showAddresses: false,
      showContacts: true,
      showStats: true,
      isEditable: true,
    },
    defaultProps: {
      customerId: "",
      displayMode: "detailed",
      showActionButtons: false,
      showBusinessInfo: true,
      showAddresses: false,
      showContacts: true,
      showStats: true,
      isEditable: true,
    },
    configurableProps: [
      "customerId",
      "displayMode",
      "showActionButtons",
      "showBusinessInfo",
      "showAddresses",
      "showContacts",
      "showStats",
      "isEditable",
    ],
    usage: "Show customer information in card format with search and selection capabilities",
    tags: ["customer", "card", "data", "search", "selection"],
    isDraggable: true,
  },
  {
    id: "customer-grid",
    name: "Customer Grid",
    description: "Grid view of multiple customers",
    category: "data",
    icon: Grid,
    preview: (
      <Box>
        <Text fontSize="lg" fontWeight="medium" mb={4}>
          Customer Grid
        </Text>
        <SimpleGrid columns={2} spacing={4}>
          {getCustomers()
            .slice(0, 4)
            .map((customer, i) => (
              <Box key={i} bg="gray.50" p={3} borderRadius="md">
                <Text fontWeight="medium">{customer.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {customer.type}
                </Text>
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    ),
    props: {
      displayMode: "grid",
      columns: 3,
      showFilters: true,
      showSearch: true,
    },
    defaultProps: {
      displayMode: "grid",
      columns: 3,
      showFilters: true,
      showSearch: true,
    },
    configurableProps: ["displayMode", "columns", "showFilters", "showSearch"],
    usage: "Display multiple customers in grid or list format",
    tags: ["customers", "grid", "list", "data"],
    isDraggable: true,
  },
  {
    id: "customer-data-table",
    name: "Customer Data Table",
    description: "Tabular view of customer data with sorting and filtering",
    category: "data",
    icon: BarChart3,
    preview: (
      <Box>
        <Text fontSize="lg" fontWeight="medium" mb={4}>
          Customer Data Table
        </Text>
        <Box bg="gray.50" p={3} borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            Table with {getCustomers().length} customers
          </Text>
          <Text fontSize="sm" color="gray.600">
            Sortable columns and filters
          </Text>
        </Box>
      </Box>
    ),
    props: {
      showFilters: true,
      showSearch: true,
      showPagination: true,
      pageSize: 10,
    },
    defaultProps: {
      showFilters: true,
      showSearch: true,
      showPagination: true,
      pageSize: 10,
    },
    configurableProps: ["showFilters", "showSearch", "showPagination", "pageSize"],
    usage: "Display customer data in sortable, filterable table format",
    tags: ["customers", "table", "data", "sorting", "filtering"],
    isDraggable: true,
  },
  {
    id: "section-container",
    name: "Section Container",
    description: "Container for grouping related content",
    category: "layout",
    icon: Layout,
    preview: (
      <Box p={6} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg">
        <Heading size="md" mb={3}>
          Section Title
        </Heading>
        <Text>This section contains related content grouped together.</Text>
      </Box>
    ),
    props: {
      title: "Section Title",
      padding: 6,
      backgroundColor: "gray.50",
      border: true,
    },
    defaultProps: {
      title: "Section Title",
      padding: 6,
      backgroundColor: "gray.50",
      border: true,
    },
    configurableProps: ["title", "padding", "backgroundColor", "border"],
    usage: "Group related content into logical sections",
    tags: ["container", "section", "grouping"],
    isDraggable: true,
  },
  {
    id: "form-field",
    name: "Form Field",
    description: "Input field for user data entry",
    category: "forms",
    icon: Settings,
    preview: (
      <Box>
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Form Field
        </Text>
        <Box bg="white" p={3} border="1px solid" borderColor="gray.300" borderRadius="md">
          <Text fontSize="sm" color="gray.500">
            Input field placeholder
          </Text>
        </Box>
      </Box>
    ),
    props: {
      label: "Field Label",
      placeholder: "Enter value",
      type: "text",
      required: false,
    },
    defaultProps: {
      label: "Field Label",
      placeholder: "Enter value",
      type: "text",
      required: false,
    },
    configurableProps: ["label", "placeholder", "type", "required"],
    usage: "Collect user input in forms",
    tags: ["form", "input", "field"],
    isDraggable: true,
  },
];

const categories = [
  { key: "layout", label: "Layout", icon: Layout, color: "blue" },
  { key: "content", label: "Content", icon: FileText, color: "green" },
  { key: "data", label: "Data", icon: BarChart3, color: "purple" },
  { key: "media", label: "Media", icon: Image, color: "orange" },
  { key: "forms", label: "Forms", icon: Settings, color: "teal" },
  { key: "navigation", label: "Navigation", icon: Link2, color: "pink" },
];

interface ComponentGalleryProps {
  onComponentSelect?: (component: ComponentExample) => void;
  onComponentDragStart?: (component: ComponentExample, event: React.DragEvent) => void;
  showAddButton?: boolean;
  enableDragAndDrop?: boolean;
}

export function ComponentGallery({
  onComponentSelect,
  onComponentDragStart,
  showAddButton = true,
  enableDragAndDrop = true,
}: ComponentGalleryProps) {
  return (
    <ComponentGalleryClient
      componentExamples={componentExamples}
      categories={categories}
      onComponentSelect={onComponentSelect}
      onComponentDragStart={onComponentDragStart}
      showAddButton={showAddButton}
      enableDragAndDrop={enableDragAndDrop}
    />
  );
}

// Export types and data for external use
export { componentExamples, categories };
