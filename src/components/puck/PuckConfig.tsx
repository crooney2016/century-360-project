import { Config } from "@measured/puck";
import React from "react";
import { Box, VStack, HStack, Text, Heading, SimpleGrid, Button } from "@chakra-ui/react";
// Note: Icons are provided via ComponentGallery; PuckConfig does not render icons directly.
import { CustomerCard } from "./CustomerCard";

// Customer Card Component using the imported CustomerCard
const CustomerCardComponent: React.FC<{
  customerId?: string;
  displayMode?: "compact" | "detailed" | "full";
  showActionButtons?: boolean;
  showBusinessInfo?: boolean;
  showAddresses?: boolean;
  showContacts?: boolean;
  showStats?: boolean;
  isEditable?: boolean;
}> = props => {
  return <CustomerCard {...props} />;
};

// Icons are handled in ComponentGallery; no icon map needed here.

// Enhanced Customer Grid Component
const CustomerGrid: React.FC<{
  customers?: Array<{
    name: string;
    role: string;
    company: string;
    avatar?: string;
    description?: string;
    customerType?: "retail" | "wholesale" | "enterprise" | "partner";
    email?: string;
    phone?: string;
    website?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    shippingAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    billingAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    creditLimit?: number;
    paymentTerms?: string;
    taxExempt?: boolean;
  }>;
  columns?: number;
  showDetails?: boolean;
}> = ({ customers, columns = 3, showDetails = true }) => (
  <Box p={4}>
    <SimpleGrid columns={columns} spacing={6}>
      {(
        customers || [
          {
            name: "John Doe",
            role: "CEO",
            company: "Tech Corp",
            customerType: "enterprise",
            email: "john.doe@techcorp.com",
            phone: "+1 (555) 123-4567",
            website: "www.techcorp.com",
            address: {
              street: "123 Business Ave",
              city: "San Francisco",
              state: "CA",
              zipCode: "94105",
              country: "USA",
            },
            creditLimit: 50000,
            paymentTerms: "Net 30",
            taxExempt: false,
          },
          {
            name: "Jane Smith",
            role: "CTO",
            company: "Innovation Inc",
            customerType: "wholesale",
            email: "jane.smith@innovation.com",
            phone: "+1 (555) 987-6543",
            website: "www.innovation.com",
            address: {
              street: "456 Innovation Blvd",
              city: "Austin",
              state: "TX",
              zipCode: "73301",
              country: "USA",
            },
            creditLimit: 25000,
            paymentTerms: "Net 15",
            taxExempt: true,
          },
          {
            name: "Bob Johnson",
            role: "CFO",
            company: "Growth Ltd",
            customerType: "retail",
            email: "bob.johnson@growth.com",
            phone: "+1 (555) 456-7890",
            website: "www.growth.com",
            address: {
              street: "789 Growth Street",
              city: "Seattle",
              state: "WA",
              zipCode: "98101",
              country: "USA",
            },
            creditLimit: 10000,
            paymentTerms: "Net 30",
            taxExempt: false,
          },
        ]
      ).map((customer, i: number) => (
        <CustomerCard key={i} {...customer} />
      ))}
    </SimpleGrid>
  </Box>
);

// Enhanced Data Table Component with Business Context
const DataTable: React.FC<{
  headers?: string[];
  rows?: string[][];
  showCustomerType?: boolean;
  showContactInfo?: boolean;
}> = ({ headers, rows, showCustomerType = true, showContactInfo = true }) => (
  <Box p={4} overflowX="auto">
    <Box as="table" width="100%" border="1px solid" borderColor="gray.200" borderRadius="md">
      <Box as="thead" bg="gray.50">
        <Box as="tr">
          {(headers || ["Name", "Company", "Type", "Email", "Phone", "Credit Limit", "Status"]).map(
            (header: string, i: number) => (
              <Box
                key={i}
                as="th"
                px={4}
                py={3}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                {header}
              </Box>
            )
          )}
        </Box>
      </Box>
      <Box as="tbody">
        {(
          rows || [
            [
              "John Doe",
              "Tech Corp",
              "Enterprise",
              "john@techcorp.com",
              "+1 (555) 123-4567",
              "$50,000",
              "Active",
            ],
            [
              "Jane Smith",
              "Innovation Inc",
              "Wholesale",
              "jane@innovation.com",
              "+1 (555) 987-6543",
              "$25,000",
              "Active",
            ],
            [
              "Bob Johnson",
              "Growth Ltd",
              "Retail",
              "bob@growth.com",
              "+1 (555) 456-7890",
              "$10,000",
              "Pending",
            ],
          ]
        ).map((row: string[], i: number) => (
          <Box key={i} as="tr" _hover={{ bg: "gray.50" }}>
            {row.map((cell: string, j: number) => (
              <Box
                key={j}
                as="td"
                px={4}
                py={3}
                fontSize="sm"
                color="gray.700"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                {cell}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

// Hero Section Component with Realistic Scaling
const HeroSection: React.FC<{
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  height?: string;
}> = ({ title, subtitle, backgroundColor, textColor, padding, height = "400px" }) => (
  <Box
    p={padding || 8}
    bg={backgroundColor || "blue.500"}
    color={textColor || "white"}
    borderRadius="lg"
    textAlign="center"
    minH={height}
    display="flex"
    alignItems="center"
    justifyContent="center"
    position="relative"
    overflow="hidden"
  >
    {/* Background Pattern */}
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      opacity={0.1}
      background="radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)"
    />

    <VStack spacing={6} position="relative" zIndex={1}>
      {title && (
        <Heading size="2xl" maxW="4xl" lineHeight="1.2">
          {title}
        </Heading>
      )}
      {subtitle && (
        <Text fontSize="xl" opacity={0.9} maxW="2xl" lineHeight="1.4">
          {subtitle}
        </Text>
      )}
    </VStack>
  </Box>
);

// Text Block Component with Realistic Typography
const TextBlock: React.FC<{
  title?: string;
  text?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
  maxWidth?: string;
}> = ({ title, text, fontSize, fontWeight, textAlign, color, maxWidth = "prose" }) => (
  <Box p={6} maxW={maxWidth} mx="auto">
    {title && (
      <Heading
        size="lg"
        mb={4}
        color={color || "gray.800"}
        textAlign={(textAlign || "left") as any}
      >
        {title}
      </Heading>
    )}
    {text && (
      <Text
        fontSize={fontSize || "md"}
        fontWeight={fontWeight || "normal"}
        textAlign={(textAlign || "left") as any}
        color={color || "gray.800"}
        lineHeight="1.6"
      >
        {text}
      </Text>
    )}
  </Box>
);

// Content Grid Component with Realistic Spacing
const ContentGrid: React.FC<{
  columns?: number;
  spacing?: number;
  items?: string[];
  cardStyle?: boolean;
}> = ({ columns, spacing, items, cardStyle = true }) => (
  <Box p={6}>
    <SimpleGrid columns={columns || 3} spacing={spacing || 6}>
      {(items || ["Content 1", "Content 2", "Content 3"]).map((item: string, i: number) => (
        <Box
          key={i}
          bg={cardStyle ? "white" : "gray.100"}
          p={cardStyle ? 6 : 4}
          borderRadius="lg"
          textAlign="center"
          border={cardStyle ? "1px solid" : "none"}
          borderColor={cardStyle ? "gray.200" : "transparent"}
          shadow={cardStyle ? "sm" : "none"}
          minH="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="md" color="gray.700">
            {item}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
);

// Section Container Component with Realistic Layout
const SectionContainer: React.FC<{
  children?: React.ReactNode;
  padding?: number;
  backgroundColor?: string;
  maxWidth?: string;
  fullWidth?: boolean;
}> = ({ children, padding, backgroundColor, maxWidth, fullWidth = false }) => (
  <Box
    p={padding || 8}
    bg={backgroundColor || "transparent"}
    maxW={fullWidth ? "full" : maxWidth || "7xl"}
    mx="auto"
    w="full"
  >
    {children}
  </Box>
);

// Form Field Component with Realistic Styling
const FormField: React.FC<{
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}> = ({ label, type, placeholder, required, helperText }) => (
  <Box mb={6}>
    <Text as="label" display="block" mb={2} fontWeight="medium" color="gray.700">
      {label}
      {required && (
        <Text as="span" color="red.500" ml={1}>
          *
        </Text>
      )}
    </Text>
    {type === "textarea" ? (
      <Box
        as="textarea"
        width="100%"
        p={4}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        placeholder={placeholder}
        rows={4}
        fontSize="md"
        _focus={{
          borderColor: "blue.500",
          outline: "none",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
        _hover={{ borderColor: "gray.400" }}
        transition="all 0.2s"
      />
    ) : (
      <Box
        as="input"
        type={type || "text"}
        width="100%"
        p={4}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        placeholder={placeholder}
        fontSize="md"
        _focus={{
          borderColor: "blue.500",
          outline: "none",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
        _hover={{ borderColor: "gray.400" }}
        transition="all 0.2s"
      />
    )}
    {helperText && (
      <Text fontSize="sm" color="gray.500" mt={2}>
        {helperText}
      </Text>
    )}
  </Box>
);

// Navigation Component with Realistic Spacing
const Navigation: React.FC<{
  items?: string[];
  variant?: string;
  sticky?: boolean;
}> = ({ items, variant, sticky = false }) => (
  <Box
    as="nav"
    p={6}
    bg="white"
    borderBottom="1px solid"
    borderColor="gray.200"
    position={sticky ? "sticky" : "relative"}
    top={sticky ? 0 : "auto"}
    zIndex={sticky ? 10 : "auto"}
  >
    <HStack spacing={8} justify={variant === "centered" ? "center" : "flex-start"}>
      {(items || ["Home", "About", "Services", "Contact"]).map((item: string, i: number) => (
        <Button
          key={i}
          variant="ghost"
          size="md"
          color="gray.700"
          _hover={{ bg: "gray.100", color: "gray.900" }}
          _active={{ bg: "gray.200" }}
          fontWeight="medium"
        >
          {item}
        </Button>
      ))}
    </HStack>
  </Box>
);

// Puck Configuration with Enhanced Fields
export const puckConfig: Config = {
  components: {
    "hero-section": {
      fields: {
        title: {
          type: "text",
          label: "Title",
        },
        subtitle: {
          type: "text",
          label: "Subtitle",
        },
        backgroundColor: {
          type: "select",
          label: "Background Color",
          options: [
            { label: "Primary Blue", value: "blue.500" },
            { label: "Success Green", value: "green.500" },
            { label: "Warning Orange", value: "orange.500" },
            { label: "Purple", value: "purple.500" },
            { label: "Gray", value: "gray.500" },
          ],
        },
        textColor: {
          type: "select",
          label: "Text Color",
          options: [
            { label: "White", value: "white" },
            { label: "Black", value: "black" },
            { label: "Gray", value: "gray.800" },
          ],
        },
        padding: {
          type: "number",
          label: "Padding",
          min: 4,
          max: 20,
        },
        height: {
          type: "select",
          label: "Height",
          options: [
            { label: "Small (300px)", value: "300px" },
            { label: "Medium (400px)", value: "400px" },
            { label: "Large (500px)", value: "500px" },
            { label: "Extra Large (600px)", value: "600px" },
          ],
        },
      },
      defaultProps: {
        title: "Welcome to Century 360",
        subtitle: "Your comprehensive business platform",
        backgroundColor: "blue.500",
        textColor: "white",
        padding: 8,
        height: "400px",
      },
      render: (props: any) => <HeroSection {...props} />,
    },

    "text-block": {
      fields: {
        title: {
          type: "text",
          label: "Title",
        },
        text: {
          type: "textarea",
          label: "Content",
        },
        fontSize: {
          type: "select",
          label: "Font Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
          ],
        },
        fontWeight: {
          type: "select",
          label: "Font Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Medium", value: "medium" },
            { label: "Semibold", value: "semibold" },
            { label: "Bold", value: "bold" },
          ],
        },
        textAlign: {
          type: "radio",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },
        color: {
          type: "select",
          label: "Text Color",
          options: [
            { label: "Default", value: "gray.800" },
            { label: "Primary", value: "blue.600" },
            { label: "Secondary", value: "gray.600" },
            { label: "Muted", value: "gray.500" },
          ],
        },
        maxWidth: {
          type: "select",
          label: "Maximum Width",
          options: [
            { label: "Narrow (prose)", value: "prose" },
            { label: "Medium (2xl)", value: "2xl" },
            { label: "Wide (4xl)", value: "4xl" },
            { label: "Full Width", value: "full" },
          ],
        },
      },
      defaultProps: {
        title: "Section Title",
        text: "This is the main content for this section. You can add multiple paragraphs and format the text as needed.",
        fontSize: "md",
        fontWeight: "normal",
        textAlign: "left",
        color: "gray.800",
        maxWidth: "prose",
      },
      render: (props: any) => <TextBlock {...props} />,
    },

    "content-grid": {
      fields: {
        columns: {
          type: "number",
          label: "Number of Columns",
          min: 1,
          max: 6,
        },
        spacing: {
          type: "number",
          label: "Spacing Between Items",
          min: 2,
          max: 12,
        },
        items: {
          type: "array",
          label: "Grid Items",
          arrayFields: {
            content: {
              type: "text",
              label: "Item Content",
            },
          },
        },
        // cardStyle toggle omitted in fields (controlled via defaultProps/UI)
      },
      defaultProps: {
        columns: 3,
        spacing: 6,
        items: ["Content 1", "Content 2", "Content 3"],
        cardStyle: true,
      },
      render: (props: any) => <ContentGrid {...props} />,
    },

    "customer-card": {
      fields: {
        customerId: {
          type: "text",
          label: "Select Customer to Display",
        },
        displayMode: {
          type: "select",
          label: "Display Mode",
          options: [
            { label: "Compact", value: "compact" },
            { label: "Detailed (Full Profile)", value: "detailed" },
            { label: "Full", value: "full" },
          ],
        },
        // presentation toggles omitted to satisfy strict types; controlled via defaultProps/UI
        // presentation toggles omitted to satisfy strict types
        // presentation toggles omitted to satisfy strict types
        // presentation toggles omitted to satisfy strict types
        // presentation toggles omitted to satisfy strict types
        // presentation toggles omitted to satisfy strict types
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
      render: (props: any) => <CustomerCardComponent {...props} />,
    },

    "customer-grid": {
      fields: {
        columns: {
          type: "number",
          label: "Number of Columns",
          min: 1,
          max: 4,
        },
        showDetails: {
          type: "radio",
          label: "Show Detailed Information",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
      },
      defaultProps: {
        columns: 3,
        showDetails: true,
      },
      render: (props: any) => <CustomerGrid {...props} />,
    },

    "data-table": {
      fields: {
        headers: {
          type: "array",
          label: "Table Headers",
          arrayFields: {
            header: { type: "text", label: "Header" },
          },
        },
        rows: {
          type: "array",
          label: "Table Rows",
          arrayFields: {
            row: {
              type: "array",
              label: "Row Data",
              arrayFields: {
                cell: { type: "text", label: "Cell" },
              },
            },
          },
        },
      },
      defaultProps: {
        headers: ["Name", "Company", "Type", "Email", "Phone", "Credit Limit", "Status"],
        rows: [
          [
            "John Doe",
            "Tech Corp",
            "Enterprise",
            "john@techcorp.com",
            "+1 (555) 123-4567",
            "$50,000",
            "Active",
          ],
          [
            "Jane Smith",
            "Innovation Inc",
            "Wholesale",
            "jane@innovation.com",
            "+1 (555) 987-6543",
            "$25,000",
            "Active",
          ],
        ],
      },
      render: (props: any) => <DataTable {...props} />,
    },

    "section-container": {
      fields: {
        padding: {
          type: "number",
          label: "Padding",
          min: 2,
          max: 20,
        },
        backgroundColor: {
          type: "select",
          label: "Background Color",
          options: [
            { label: "Transparent", value: "transparent" },
            { label: "Light Gray", value: "gray.50" },
            { label: "White", value: "white" },
            { label: "Primary Light", value: "blue.50" },
          ],
        },
        maxWidth: {
          type: "select",
          label: "Maximum Width",
          options: [
            { label: "Small", value: "4xl" },
            { label: "Medium", value: "6xl" },
            { label: "Large", value: "7xl" },
            { label: "Full", value: "full" },
          ],
        },
        fullWidth: {
          type: "radio",
          label: "Full Width",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
      },
      defaultProps: {
        padding: 8,
        backgroundColor: "transparent",
        maxWidth: "7xl",
        fullWidth: false,
      },
      render: (props: any) => <SectionContainer {...props} />,
    },

    "form-field": {
      fields: {
        label: {
          type: "text",
          label: "Field Label",
        },
        type: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Text", value: "text" },
            { label: "Email", value: "email" },
            { label: "Password", value: "password" },
            { label: "Textarea", value: "textarea" },
          ],
        },
        placeholder: {
          type: "text",
          label: "Placeholder Text",
        },
        required: {
          type: "radio",
          label: "Required Field",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        helperText: {
          type: "text",
          label: "Helper Text",
        },
      },
      defaultProps: {
        label: "Field Label",
        type: "text",
        placeholder: "Enter your text here",
        required: false,
        helperText: "",
      },
      render: (props: any) => <FormField {...props} />,
    },

    navigation: {
      fields: {
        items: {
          type: "array",
          label: "Navigation Items",
          arrayFields: {
            item: { type: "text", label: "Item" },
          },
        },
        variant: {
          type: "radio",
          label: "Alignment",
          options: [
            { label: "Left Aligned", value: "left" },
            { label: "Centered", value: "centered" },
          ],
        },
        sticky: {
          type: "radio",
          label: "Sticky Navigation",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
      },
      defaultProps: {
        items: ["Home", "About", "Services", "Contact"],
        variant: "left",
        sticky: false,
      },
      render: (props: any) => <Navigation {...props} />,
    },
  },

  categories: [
    {
      name: "Layout",
      components: ["hero-section", "content-grid", "section-container"],
    },
    {
      name: "Content",
      components: ["text-block"],
    },
    {
      name: "Data",
      components: ["customer-card", "customer-grid", "data-table"],
    },
    {
      name: "Forms",
      components: ["form-field"],
    },
    {
      name: "Navigation",
      components: ["navigation"],
    },
  ],
};

// Note: Puck v0.19 does not expose 'zones' on Config; templates/slots are handled at usage time.
export default puckConfig;
