"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useToast,
  Badge,
  Icon,
  Tooltip,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Select,
  FormErrorMessage,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPackage,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiSearch,
  FiDatabase,
  FiRefreshCw,
  FiHome,
  FiFileText,
  FiGrid,
  FiInfo,
  FiSave,
} from "react-icons/fi";

// Customer Entity Interface
export interface CustomerEntity {
  id: string;
  customerNumber: string;
  name: string;
  companyName: string;
  customerType: "retail" | "wholesale" | "enterprise";
  status: "active" | "inactive" | "pending" | "suspended";
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
    primaryContact: string;
  };
  addresses: {
    billing: Address;
    shipping: Address;
  };
  businessInfo: {
    taxId: string;
    taxExempt: boolean;
    creditLimit: number;
    paymentTerms: "Net 15" | "Net 30" | "Net 45" | "Net 60";
    discountRate: number;
    currency: string;
  };
  classification: {
    industry: string;
    segment: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface InlineContentData {
  sections: InlineSection[];
}

export interface InlineSection {
  id: string;
  type: "hero" | "text" | "grid" | "customer-card" | "customer-grid" | "customer-form";
  props: Record<string, any>;
}

interface InlineContentEditorProps {
  data: InlineContentData;
  onDataChange: (data: InlineContentData) => void;
  onSave?: () => void;
  isEditing?: boolean;
}

// Mock Customer Service with Comprehensive Data
const customerService = {
  searchCustomers: async (query: string): Promise<CustomerEntity[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockCustomers: CustomerEntity[] = [
      {
        id: "cust_001",
        customerNumber: "C001",
        name: "John Doe",
        companyName: "Tech Solutions Inc.",
        customerType: "enterprise",
        status: "active",
        contactInfo: {
          email: "john.doe@techsolutions.com",
          phone: "+1 (555) 123-4567",
          website: "www.techsolutions.com",
          primaryContact: "John Doe",
        },
        addresses: {
          billing: {
            street: "123 Tech Drive",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
          shipping: {
            street: "123 Tech Drive",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "12-3456789",
          taxExempt: false,
          creditLimit: 100000,
          paymentTerms: "Net 30",
          discountRate: 2.5,
          currency: "USD",
        },
        classification: {
          industry: "Technology",
          segment: "Enterprise Software",
          tier: "platinum",
        },
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "cust_002",
        customerNumber: "C002",
        name: "Sarah Johnson",
        companyName: "Global Manufacturing Co.",
        customerType: "wholesale",
        status: "active",
        contactInfo: {
          email: "sarah.johnson@globalmfg.com",
          phone: "+1 (555) 987-6543",
          website: "www.globalmfg.com",
          primaryContact: "Sarah Johnson",
        },
        addresses: {
          billing: {
            street: "456 Industrial Blvd",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA",
          },
          shipping: {
            street: "789 Warehouse Way",
            city: "Chicago",
            state: "IL",
            zipCode: "60602",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "98-7654321",
          taxExempt: true,
          creditLimit: 250000,
          paymentTerms: "Net 45",
          discountRate: 3.0,
          currency: "USD",
        },
        classification: {
          industry: "Manufacturing",
          segment: "Industrial Equipment",
          tier: "gold",
        },
        createdAt: new Date("2022-08-20"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "cust_003",
        customerNumber: "C003",
        name: "Mike Chen",
        companyName: "Retail Plus Stores",
        customerType: "retail",
        status: "active",
        contactInfo: {
          email: "mike.chen@retailplus.com",
          phone: "+1 (555) 456-7890",
          website: "www.retailplus.com",
          primaryContact: "Mike Chen",
        },
        addresses: {
          billing: {
            street: "321 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
          shipping: {
            street: "321 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "45-6789012",
          taxExempt: false,
          creditLimit: 50000,
          paymentTerms: "Net 15",
          discountRate: 1.5,
          currency: "USD",
        },
        classification: {
          industry: "Retail",
          segment: "Consumer Goods",
          tier: "silver",
        },
        createdAt: new Date("2023-06-10"),
        updatedAt: new Date("2024-01-05"),
      },
      {
        id: "cust_004",
        customerNumber: "C004",
        name: "Lisa Rodriguez",
        companyName: "Healthcare Systems Ltd.",
        customerType: "enterprise",
        status: "pending",
        contactInfo: {
          email: "lisa.rodriguez@healthcare.com",
          phone: "+1 (555) 234-5678",
          website: "www.healthcare.com",
          primaryContact: "Lisa Rodriguez",
        },
        addresses: {
          billing: {
            street: "654 Medical Center Dr",
            city: "Boston",
            state: "MA",
            zipCode: "02101",
            country: "USA",
          },
          shipping: {
            street: "654 Medical Center Dr",
            city: "Boston",
            state: "MA",
            zipCode: "02101",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "23-4567890",
          taxExempt: true,
          creditLimit: 150000,
          paymentTerms: "Net 30",
          discountRate: 2.0,
          currency: "USD",
        },
        classification: {
          industry: "Healthcare",
          segment: "Medical Technology",
          tier: "platinum",
        },
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "cust_005",
        customerNumber: "C005",
        name: "David Wilson",
        companyName: "Construction Dynamics",
        customerType: "wholesale",
        status: "active",
        contactInfo: {
          email: "david.wilson@construction.com",
          phone: "+1 (555) 789-0123",
          website: "www.construction.com",
          primaryContact: "David Wilson",
        },
        addresses: {
          billing: {
            street: "987 Builder Lane",
            city: "Houston",
            state: "TX",
            zipCode: "77001",
            country: "USA",
          },
          shipping: {
            street: "987 Builder Lane",
            city: "Houston",
            state: "TX",
            zipCode: "77001",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "78-9012345",
          taxExempt: false,
          creditLimit: 300000,
          paymentTerms: "Net 60",
          discountRate: 2.5,
          currency: "USD",
        },
        classification: {
          industry: "Construction",
          segment: "Commercial Building",
          tier: "gold",
        },
        createdAt: new Date("2021-12-15"),
        updatedAt: new Date("2024-01-12"),
      },
      {
        id: "cust_006",
        customerNumber: "C006",
        name: "Emily Thompson",
        companyName: "Green Energy Solutions",
        customerType: "enterprise",
        status: "active",
        contactInfo: {
          email: "emily.thompson@greenenergy.com",
          phone: "+1 (555) 345-6789",
          website: "www.greenenergy.com",
          primaryContact: "Emily Thompson",
        },
        addresses: {
          billing: {
            street: "543 Solar Street",
            city: "Denver",
            state: "CO",
            zipCode: "80201",
            country: "USA",
          },
          shipping: {
            street: "543 Solar Street",
            city: "Denver",
            state: "CO",
            zipCode: "80201",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "34-5678901",
          taxExempt: true,
          creditLimit: 200000,
          paymentTerms: "Net 30",
          discountRate: 3.5,
          currency: "USD",
        },
        classification: {
          industry: "Energy",
          segment: "Renewable Energy",
          tier: "platinum",
        },
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date("2024-01-08"),
      },
      {
        id: "cust_007",
        customerNumber: "C007",
        name: "Robert Kim",
        companyName: "Food Service Express",
        customerType: "wholesale",
        status: "active",
        contactInfo: {
          email: "robert.kim@foodservice.com",
          phone: "+1 (555) 567-8901",
          website: "www.foodservice.com",
          primaryContact: "Robert Kim",
        },
        addresses: {
          billing: {
            street: "876 Kitchen Road",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA",
          },
          shipping: {
            street: "876 Kitchen Road",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "56-7890123",
          taxExempt: false,
          creditLimit: 75000,
          paymentTerms: "Net 30",
          discountRate: 2.0,
          currency: "USD",
        },
        classification: {
          industry: "Food Service",
          segment: "Restaurant Supply",
          tier: "silver",
        },
        createdAt: new Date("2023-09-15"),
        updatedAt: new Date("2024-01-03"),
      },
      {
        id: "cust_008",
        customerNumber: "C008",
        name: "Jennifer Lee",
        companyName: "Fashion Forward Retail",
        customerType: "retail",
        status: "active",
        contactInfo: {
          email: "jennifer.lee@fashion.com",
          phone: "+1 (555) 678-9012",
          website: "www.fashion.com",
          primaryContact: "Jennifer Lee",
        },
        addresses: {
          billing: {
            street: "234 Style Avenue",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
          },
          shipping: {
            street: "234 Style Avenue",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
            country: "USA",
          },
        },
        businessInfo: {
          taxId: "67-8901234",
          taxExempt: false,
          creditLimit: 40000,
          paymentTerms: "Net 15",
          discountRate: 1.0,
          currency: "USD",
        },
        classification: {
          industry: "Fashion",
          segment: "Apparel Retail",
          tier: "bronze",
        },
        createdAt: new Date("2023-11-01"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    // Filter customers based on search query
    return mockCustomers.filter(
      customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.companyName.toLowerCase().includes(query.toLowerCase()) ||
        customer.customerNumber.toLowerCase().includes(query.toLowerCase()) ||
        customer.customerType.toLowerCase().includes(query.toLowerCase()) ||
        customer.status.toLowerCase().includes(query.toLowerCase()) ||
        customer.classification.industry.toLowerCase().includes(query.toLowerCase())
    );
  },

  getCustomerById: async (id: string): Promise<CustomerEntity | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const mockCustomers = await customerService.searchCustomers("");
    return mockCustomers.find(customer => customer.id === id) || null;
  },

  getAllCustomers: async (): Promise<CustomerEntity[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return customerService.searchCustomers("");
  },
};

export function InlineContentEditor({
  data,
  onDataChange,
  onSave,
  isEditing = false,
}: InlineContentEditorProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const editModeBg = useColorModeValue("blue.50", "blue.900");
  const editModeBorder = useColorModeValue("blue.200", "blue.700");

  // Enhanced visual feedback for edit mode
  const getEditModeStyles = (isEditing: boolean) => ({
    bg: isEditing ? editModeBg : bgColor,
    border: isEditing ? `2px solid ${editModeBorder}` : `1px solid ${borderColor}`,
    borderRadius: "lg",
    transition: "all 0.2s ease-in-out",
    boxShadow: isEditing ? "lg" : "sm",
  });

  // Simplified section management
  const handleAddSection = useCallback(
    (type: string) => {
      const newSection: InlineSection = {
        id: `section-${Date.now()}`,
        type: type as any,
        props: getDefaultProps(type),
      };

      const newData = { ...data, sections: [...data.sections, newSection] };
      onDataChange(newData);
      setEditingSection(newSection.id);
      toast({
        title: "Added",
        description: `New ${type} section added`,
        status: "success",
        duration: 2000,
      });
    },
    [data, onDataChange, toast]
  );

  const handleSectionUpdate = useCallback(
    (sectionId: string, props: Record<string, any>) => {
      const newData = {
        ...data,
        sections: data.sections.map(section =>
          section.id === sectionId ? { ...section, props } : section
        ),
      };
      onDataChange(newData);
      setEditingSection(null);
      toast({
        title: "Updated",
        description: "Section updated successfully",
        status: "success",
        duration: 2000,
      });
    },
    [data, onDataChange, toast]
  );

  const handleSectionDelete = useCallback(
    (sectionId: string) => {
      const newData = {
        ...data,
        sections: data.sections.filter(section => section.id !== sectionId),
      };
      onDataChange(newData);
      toast({
        title: "Deleted",
        description: "Section removed",
        status: "success",
        duration: 2000,
      });
    },
    [data, onDataChange, toast]
  );

  const getDefaultProps = (type: string): Record<string, any> => {
    switch (type) {
      case "hero":
        return {
          title: "Welcome to Century 360",
          subtitle: "Your comprehensive business platform",
          backgroundColor: "blue.500",
          textColor: "white",
          padding: 8,
          height: "400px",
        };
      case "text":
        return {
          title: "Section Title",
          text: "This is the main content for this section. Click to edit directly.",
          fontSize: "md",
          fontWeight: "normal",
          textAlign: "left",
          color: "gray.800",
        };
      case "grid":
        return {
          columns: 3,
          spacing: 6,
          items: ["Content 1", "Content 2", "Content 3"],
          cardStyle: true,
        };
      case "customer-card":
        return {
          customerId: null,
          customerNumber: "",
          displayMode: "summary", // compact, summary, detailed
          showActions: false,
          showBusinessInfo: true,
          showAddresses: false,
        };
      case "customer-grid":
        return {
          showFilters: true,
          showSearch: true,
          columns: ["name", "company", "type", "status", "creditLimit"],
          pageSize: 10,
          sortBy: "name",
          sortOrder: "asc",
        };
      case "customer-form":
        return {
          mode: "create", // create, edit, view
          customerType: "retail",
          showValidation: true,
          autoSave: false,
          template: "standard",
        };
      default:
        return {};
    }
  };

  const renderSection = (section: InlineSection) => {
    const isEditing = editingSection === section.id;
    const isHovered = false; // No hover state for static rendering

    return (
      <Box
        key={section.id}
        position="relative"
        border={isEditing ? "2px solid" : isHovered ? "1px solid" : "1px solid"}
        borderColor={isEditing ? "blue.500" : isHovered ? "transparent" : "transparent"}
        borderRadius="lg"
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        transition="all 0.2s"
      >
        {/* Section Controls */}
        {isEditing && (
          <Box
            position="absolute"
            top={2}
            right={2}
            zIndex={10}
            bg="white"
            borderRadius="md"
            shadow="lg"
            p={1}
            border="1px solid"
            borderColor="gray.200"
          >
            <HStack spacing={1}>
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit section"
                  icon={<Icon as={FiEdit3} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingSection(section.id)}
                />
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  aria-label="Delete section"
                  icon={<Icon as={FiTrash2} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => handleSectionDelete(section.id)}
                />
              </Tooltip>
            </HStack>
          </Box>
        )}

        {/* Section Content */}
        {isEditing ? (
          <SectionEditor
            section={section}
            onSave={props => handleSectionUpdate(section.id, props)}
            onCancel={() => setEditingSection(null)}
          />
        ) : (
          <SectionRenderer section={section} />
        )}
      </Box>
    );
  };

  if (isPreviewMode) {
    return (
      <Box>
        <HStack justify="space-between" align="center" mb={4}>
          <Heading size="lg">Preview</Heading>
          <Button
            leftIcon={<Icon as={FiEyeOff} />}
            variant="outline"
            onClick={() => setIsPreviewMode(false)}
          >
            Edit
          </Button>
        </HStack>

        <Box
          p={6}
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          minH="400px"
        >
          {data.sections.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={20}>
              No content yet. Switch to edit mode to start building.
            </Text>
          ) : (
            <VStack spacing={8} align="stretch">
              {data.sections.map(renderSection)}
            </VStack>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Enhanced Mode Awareness Header */}
      <Box {...getEditModeStyles(isEditing)} p={4} mb={6} position="relative" overflow="hidden">
        {isEditing && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bg="blue.500"
            color="white"
            px={4}
            py={2}
            fontSize="sm"
            fontWeight="semibold"
            textAlign="center"
          >
            ✏️ Edit Mode - Click sections to modify, hover for options
          </Box>
        )}

        <VStack spacing={4} align="stretch" pt={isEditing ? 8 : 0}>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={isEditing ? "blue.700" : "gray.800"}>
                {isEditing ? "Page Builder" : "Content Preview"}
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {isEditing
                  ? "Build your page by adding and editing sections below"
                  : "Preview your content as it will appear to users"}
              </Text>
            </VStack>

            <HStack spacing={3}>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Icon as={FiEye} />}
                  onClick={() => setIsPreviewMode(true)}
                >
                  Preview
                </Button>
              )}

              <Button
                size="sm"
                colorScheme={isEditing ? "blue" : "gray"}
                leftIcon={<Icon as={isEditing ? FiSave : FiEdit3} />}
                onClick={() => {
                  if (isEditing) {
                    onSave?.();
                  } else {
                    setIsPreviewMode(false);
                  }
                }}
              >
                {isEditing ? "Save Page" : "Start Building"}
              </Button>
            </HStack>
          </HStack>

          {/* Progressive Disclosure: Only show when editing */}
          {isEditing && (
            <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Add New Section
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Choose a component type
                  </Text>
                </HStack>

                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={() => handleAddSection("hero")}
                    height="auto"
                    py={3}
                    flexDirection="column"
                    gap={2}
                  >
                    <Icon as={FiHome} boxSize={5} />
                    <Text fontSize="xs">Hero</Text>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={() => handleAddSection("text")}
                    height="auto"
                    py={3}
                    flexDirection="column"
                    gap={2}
                  >
                    <Icon as={FiFileText} boxSize={5} />
                    <Text fontSize="xs">Text</Text>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={() => handleAddSection("grid")}
                    height="auto"
                    py={3}
                    flexDirection="column"
                    gap={2}
                  >
                    <Icon as={FiGrid} boxSize={5} />
                    <Text fontSize="xs">Grid</Text>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Icon as={FiPlus} />}
                    onClick={() => handleAddSection("customer-card")}
                    height="auto"
                    py={3}
                    flexDirection="column"
                    gap={2}
                  >
                    <Icon as={FiUser} boxSize={5} />
                    <Text fontSize="xs">Customer</Text>
                  </Button>
                </SimpleGrid>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Content Sections with Enhanced Visual Feedback */}
      <VStack spacing={6} align="stretch">
        {data.sections.map((section, index) => (
          <Box
            key={section.id}
            position="relative"
            {...getEditModeStyles(isEditing)}
            p={isEditing ? 2 : 0}
          >
            {/* Edit Mode Overlay */}
            {isEditing && (
              <Box
                position="absolute"
                top={2}
                right={2}
                zIndex={10}
                opacity={0}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s ease-in-out"
              >
                <HStack spacing={2}>
                  <IconButton
                    size="sm"
                    variant="solid"
                    colorScheme="blue"
                    aria-label="Edit section"
                    icon={<Icon as={FiEdit3} />}
                    onClick={() => setEditingSection(section.id)}
                  />
                  <IconButton
                    size="sm"
                    variant="solid"
                    colorScheme="red"
                    aria-label="Delete section"
                    icon={<Icon as={FiTrash2} />}
                    onClick={() => handleSectionDelete(section.id)}
                  />
                </HStack>
              </Box>
            )}

            {/* Section Content */}
            <Box
              cursor={isEditing ? "pointer" : "default"}
              onClick={() => isEditing && setEditingSection(section.id)}
              transition="all 0.2s ease-in-out"
              _hover={isEditing ? { transform: "translateY(-2px)", boxShadow: "lg" } : {}}
            >
              {editingSection === section.id ? (
                <SectionEditor
                  section={section}
                  onSave={props => handleSectionUpdate(section.id, props)}
                  onCancel={() => setEditingSection(null)}
                />
              ) : (
                <Box
                  position="relative"
                  _hover={isEditing ? { bg: "blue.50", borderRadius: "md" } : {}}
                  p={isEditing ? 4 : 0}
                  transition="all 0.2s ease-in-out"
                >
                  {renderSection(section)}

                  {/* Edit Mode Hover Indicator */}
                  {isEditing && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      border="2px dashed"
                      borderColor="blue.300"
                      borderRadius="md"
                      opacity={0}
                      _hover={{ opacity: 1 }}
                      transition="opacity 0.2s ease-in-out"
                      pointerEvents="none"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize="sm"
                        color="blue.600"
                        fontWeight="semibold"
                        bg="white"
                        px={3}
                        py={1}
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        Click to edit
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {/* Empty State with Clear Guidance */}
        {data.sections.length === 0 && (
          <Box
            textAlign="center"
            py={12}
            px={6}
            bg="gray.50"
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="lg"
          >
            <VStack spacing={4}>
              <Icon as={FiPlus} boxSize={12} color="gray.400" />
              <VStack spacing={2}>
                <Heading size="md" color="gray.600">
                  {isEditing ? "Start Building Your Page" : "No Content Yet"}
                </Heading>
                <Text fontSize="sm" color="gray.500" maxW="md">
                  {isEditing
                    ? "Click &apos;Start Building&apos; above to add your first section and begin creating your page."
                    : "This page doesn&apos;t have any content yet. Start building to add sections."}
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </VStack>

      {/* Enhanced Help Text */}
      {isEditing && data.sections.length > 0 && (
        <Box mt={8} p={4} bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md">
          <HStack spacing={3} align="start">
            <Icon as={FiInfo} boxSize={5} color="blue.500" mt={0.5} />
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                Building Tips
              </Text>
              <Text fontSize="sm" color="blue.600">
                • <strong>Hover</strong> over sections to see edit options • <strong>Click</strong>{" "}
                any section to modify its content • <strong>Drag</strong> sections to reorder them •{" "}
                <strong>Preview</strong> your page to see the final result
              </Text>
            </VStack>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

// Enhanced Section Editor with Customer Business Rules
function SectionEditor({
  section,
  onSave,
  onCancel,
}: {
  section: InlineSection;
  onSave: (props: Record<string, any>) => void;
  onCancel: () => void;
}) {
  const [localProps, setLocalProps] = useState(section.props);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerEntity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerEntity | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSave = () => {
    onSave(localProps);
  };

  const handleCustomerSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await customerService.searchCustomers(searchQuery);
      setSearchResults(results);
      onOpen();
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCustomerSelect = (customer: CustomerEntity) => {
    setSelectedCustomer(customer);
    setLocalProps({
      ...localProps,
      customerId: customer.id,
      customerNumber: customer.customerNumber,
    });
    onClose();
    toast({
      title: "Customer Selected",
      description: `${customer.name} is now displayed in this section`,
      status: "success",
      duration: 2000,
    });
  };

  const renderField = (key: string, value: any) => {
    if (key === "customerId" && section.type === "customer-card") {
      return (
        <FormControl key={key}>
          <FormLabel fontSize="sm" fontWeight="medium">
            Select Customer to Display
          </FormLabel>
          <HStack spacing={2}>
            <Input
              placeholder="Search existing customers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              size="sm"
            />
            <Button
              size="sm"
              leftIcon={<Icon as={FiSearch} />}
              onClick={handleCustomerSearch}
              isLoading={isSearching}
            >
              Search
            </Button>
          </HStack>
          {selectedCustomer && (
            <Text fontSize="sm" color="green.600" mt={1}>
              ✓ {selectedCustomer.name} ({selectedCustomer.customerNumber})
            </Text>
          )}
          <Text fontSize="xs" color="gray.500" mt={1}>
            This will display the selected customer&apos;s information on your page
          </Text>
        </FormControl>
      );
    }

    if (key === "displayMode") {
      return (
        <FormControl key={key}>
          <FormLabel fontSize="sm" fontWeight="medium">
            Display Mode
          </FormLabel>
          <Select
            value={value}
            onChange={e => setLocalProps({ ...localProps, [key]: e.target.value })}
            size="sm"
          >
            <option value="summary">Summary (Basic Info)</option>
            <option value="detailed">Detailed (Full Profile)</option>
            <option value="compact">Compact (Minimal)</option>
          </Select>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Choose how much customer information to show
          </Text>
        </FormControl>
      );
    }

    if (key === "showBusinessInfo" || key === "showAddresses" || key === "showActions") {
      return (
        <FormControl key={key} display="flex" alignItems="center">
          <FormLabel fontSize="sm" fontWeight="medium" mb="0">
            {key === "showBusinessInfo" && "Show Business Information"}
            {key === "showAddresses" && "Show Addresses"}
            {key === "showActions" && "Show Action Buttons"}
          </FormLabel>
          <Switch
            isChecked={value}
            onChange={e => setLocalProps({ ...localProps, [key]: e.target.checked })}
            ml="auto"
          />
        </FormControl>
      );
    }

    if (typeof value === "string") {
      if (key.includes("text") || key.includes("content")) {
        return (
          <FormControl key={key}>
            <FormLabel fontSize="sm" fontWeight="medium">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
            </FormLabel>
            <Textarea
              value={value}
              onChange={e => setLocalProps({ ...localProps, [key]: e.target.value })}
              size="sm"
              rows={3}
            />
          </FormControl>
        );
      }
      return (
        <FormControl key={key}>
          <FormLabel fontSize="sm" fontWeight="medium">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
          </FormLabel>
          <Input
            value={value}
            onChange={e => setLocalProps({ ...localProps, [key]: e.target.value })}
            size="sm"
          />
        </FormControl>
      );
    } else if (typeof value === "number") {
      return (
        <FormControl key={key}>
          <FormLabel fontSize="sm" fontWeight="medium">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
          </FormLabel>
          <NumberInput
            value={value}
            onChange={(_, val) => setLocalProps({ ...localProps, [key]: val })}
            size="sm"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      );
    } else if (typeof value === "boolean") {
      return (
        <FormControl key={key} display="flex" alignItems="center">
          <FormLabel fontSize="sm" fontWeight="medium" mb="0">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
          </FormLabel>
          <Switch
            isChecked={value}
            onChange={e => setLocalProps({ ...localProps, [key]: e.target.checked })}
            ml="auto"
          />
        </FormControl>
      );
    }
    return null;
  };

  return (
    <>
      <Box p={6} bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md">
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md" color="blue.700">
              Edit {section.type}
            </Heading>
            <HStack spacing={2}>
              <Button size="sm" colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </HStack>
          </HStack>

          <Divider />

          <SimpleGrid columns={2} spacing={4}>
            {Object.entries(localProps).map(([key, value]) => renderField(key, value))}
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Customer Search Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Customer to Display</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Found {searchResults.length} customer(s) matching &quot;{searchQuery}&quot;
              </Text>

              {searchResults.length > 0 ? (
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Customer #</Th>
                        <Th>Name</Th>
                        <Th>Company</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {searchResults.map(customer => (
                        <Tr key={customer.id}>
                          <Td>{customer.customerNumber}</Td>
                          <Td>{customer.name}</Td>
                          <Td>{customer.companyName}</Td>
                          <Td>
                            <Badge colorScheme={getCustomerTypeColor(customer.customerType)}>
                              {customer.customerType}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getCustomerStatusColor(customer.status)}>
                              {customer.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Button size="sm" onClick={() => handleCustomerSelect(customer)}>
                              Select
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  <AlertTitle>No Results</AlertTitle>
                  <AlertDescription>
                    No customers found matching your search criteria.
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// Enhanced Section Renderer with Customer Data Binding
function SectionRenderer({ section }: { section: InlineSection }) {
  const { props } = section;

  switch (section.type) {
    case "hero":
      return (
        <Box
          p={props.padding || 8}
          bg={props.backgroundColor || "blue.500"}
          color={props.textColor || "white"}
          borderRadius="lg"
          textAlign="center"
          minH={props.height || "400px"}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={6}>
            {props.title && (
              <Heading size="2xl" maxW="4xl" lineHeight="1.2">
                {props.title}
              </Heading>
            )}
            {props.subtitle && (
              <Text fontSize="xl" opacity={0.9} maxW="2xl" lineHeight="1.4">
                {props.subtitle}
              </Text>
            )}
          </VStack>
        </Box>
      );

    case "text":
      return (
        <Box p={6} maxW="prose" mx="auto">
          {props.title && (
            <Heading
              size="lg"
              mb={4}
              color={props.color || "gray.800"}
              textAlign={props.textAlign || "left"}
            >
              {props.title}
            </Heading>
          )}
          {props.text && (
            <Text
              fontSize={props.fontSize || "md"}
              fontWeight={props.fontWeight || "normal"}
              textAlign={props.textAlign || "left"}
              color={props.color || "gray.800"}
              lineHeight="1.6"
            >
              {props.text}
            </Text>
          )}
        </Box>
      );

    case "grid":
      return (
        <Box p={6}>
          <SimpleGrid columns={props.columns || 3} spacing={props.spacing || 6}>
            {(props.items || ["Content 1", "Content 2", "Content 3"]).map(
              (item: string, i: number) => (
                <Box
                  key={i}
                  bg={props.cardStyle ? "white" : "gray.100"}
                  p={props.cardStyle ? 6 : 4}
                  borderRadius="lg"
                  textAlign="center"
                  border={props.cardStyle ? "1px solid" : "none"}
                  borderColor={props.cardStyle ? "gray.200" : "transparent"}
                  shadow={props.cardStyle ? "sm" : "none"}
                  minH="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="md" color="gray.700">
                    {item}
                  </Text>
                </Box>
              )
            )}
          </SimpleGrid>
        </Box>
      );

    case "customer-card":
      return <CustomerCardRenderer props={props} />;

    case "customer-grid":
      return <CustomerGridRenderer props={props} />;

    case "customer-form":
      return <CustomerFormRenderer props={props} />;

    default:
      return (
        <Box p={4} bg="gray.100" borderRadius="md" textAlign="center">
          <Text color="gray.500">Unknown section type: {section.type}</Text>
        </Box>
      );
  }
}

// Customer Card Component with Data Binding
function CustomerCardRenderer({ props }: { props: Record<string, any> }) {
  const [customer, setCustomer] = useState<CustomerEntity | null>(null);
  const [loading, setLoading] = useState(false);

  // In real app, this would fetch customer data based on props.customerId
  React.useEffect(() => {
    if (props.customerId) {
      setLoading(true);
      // Simulate API call to fetch existing customer data
      setTimeout(() => {
        // Mock customer data - in real app this would come from your customer database
        const mockCustomer = {
          id: props.customerId,
          customerNumber: props.customerNumber || "C001",
          name: "John Doe",
          companyName: "Tech Solutions Inc.",
          customerType: "enterprise" as const,
          status: "active" as const,
          contactInfo: {
            email: "john.doe@techsolutions.com",
            phone: "+1 (555) 123-4567",
            website: "www.techsolutions.com",
            primaryContact: "John Doe",
          },
          addresses: {
            billing: {
              street: "123 Tech Drive",
              city: "San Francisco",
              state: "CA",
              zipCode: "94105",
              country: "USA",
            },
            shipping: {
              street: "123 Tech Drive",
              city: "San Francisco",
              state: "CA",
              zipCode: "94105",
              country: "USA",
            },
          },
          businessInfo: {
            taxId: "12-3456789",
            taxExempt: false,
            creditLimit: 100000,
            paymentTerms: "Net 30" as const,
            discountRate: 2.5,
            currency: "USD",
          },
          classification: {
            industry: "Technology",
            segment: "Enterprise Software",
            tier: "platinum" as const,
          },
          createdAt: new Date("2023-01-15"),
          updatedAt: new Date("2024-01-15"),
        };
        setCustomer(mockCustomer);
        setLoading(false);
      }, 500);
    }
  }, [props.customerId, props.customerNumber]);

  if (loading) {
    return (
      <Box p={4}>
        <Card shadow="sm">
          <CardBody p={4}>
            <Text>Loading customer data...</Text>
          </CardBody>
        </Card>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box p={4}>
        <Card shadow="sm">
          <CardBody p={4}>
            <VStack spacing={4} align="center">
              <Icon as={FiDatabase} boxSize={8} color="gray.400" />
              <Text color="gray.500">No customer selected</Text>
              <Text fontSize="sm" color="gray.400">
                Edit this section to select an existing customer to display
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  const displayMode = props.displayMode || "summary";

  // Render based on display mode
  if (displayMode === "compact") {
    return (
      <Box p={4}>
        <Card shadow="sm">
          <CardBody p={4}>
            <HStack spacing={3} align="center">
              <Box
                bg="gray.100"
                borderRadius="full"
                boxSize="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={getCustomerTypeIcon(customer.customerType)}
                  boxSize={4}
                  color="gray.500"
                />
              </Box>
              <VStack spacing={1} align="start" flex={1}>
                <Text fontWeight="semibold" noOfLines={1}>
                  {customer.name}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {customer.companyName}
                </Text>
              </VStack>
              <Badge colorScheme={getCustomerTypeColor(customer.customerType)} size="sm">
                {customer.customerType}
              </Badge>
            </HStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  if (displayMode === "summary") {
    return (
      <Box p={4}>
        <Card shadow="sm">
          <CardBody p={4}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3} align="start">
                <Box
                  bg="gray.100"
                  borderRadius="full"
                  boxSize="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={getCustomerTypeIcon(customer.customerType)}
                    boxSize={5}
                    color="gray.500"
                  />
                </Box>

                <VStack spacing={1} align="start" flex={1}>
                  <HStack spacing={2} align="center">
                    <Heading size="md" noOfLines={1}>
                      {customer.name}
                    </Heading>
                    <Badge colorScheme={getCustomerStatusColor(customer.status)} size="sm">
                      {customer.status}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {customer.companyName}
                  </Text>
                  <HStack spacing={2}>
                    <Badge
                      colorScheme={getCustomerTypeColor(customer.customerType)}
                      variant="subtle"
                      size="sm"
                    >
                      {getCustomerTypeLabel(customer.customerType)}
                    </Badge>
                    <Badge
                      colorScheme={getCustomerTierColor(customer.classification.tier)}
                      variant="subtle"
                      size="sm"
                    >
                      {customer.classification.tier}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              <Divider />

              <VStack spacing={2} align="stretch">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Contact
                </Text>
                {customer.contactInfo.email && (
                  <HStack spacing={2} fontSize="sm">
                    <Icon as={FiMail} boxSize={3} color="gray.400" />
                    <Text color="blue.600" noOfLines={1}>
                      {customer.contactInfo.email}
                    </Text>
                  </HStack>
                )}
                {customer.contactInfo.phone && (
                  <HStack spacing={2} fontSize="sm">
                    <Icon as={FiPhone} boxSize={3} color="gray.400" />
                    <Text color="gray.700" noOfLines={1}>
                      {customer.contactInfo.phone}
                    </Text>
                  </HStack>
                )}
              </VStack>

              {props.showBusinessInfo && (
                <VStack spacing={2} align="stretch">
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.500"
                    textTransform="uppercase"
                  >
                    Business
                  </Text>
                  <HStack spacing={2} fontSize="sm">
                    <Icon as={FiCreditCard} boxSize={3} color="gray.400" />
                    <Text color="gray.700">
                      Credit: ${customer.businessInfo.creditLimit.toLocaleString()}
                    </Text>
                  </HStack>
                  <HStack spacing={2} fontSize="sm">
                    <Icon as={FiTruck} boxSize={3} color="gray.400" />
                    <Text color="gray.700">Terms: {customer.businessInfo.paymentTerms}</Text>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  // Detailed mode - full customer profile
  return (
    <Box p={4}>
      <Card shadow="sm">
        <CardBody p={4}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3} align="start">
              <Box
                bg="gray.100"
                borderRadius="full"
                boxSize="60px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={getCustomerTypeIcon(customer.customerType)}
                  boxSize={6}
                  color="gray.500"
                />
              </Box>

              <VStack spacing={1} align="start" flex={1}>
                <HStack spacing={2} align="center">
                  <Heading size="md" noOfLines={1}>
                    {customer.name}
                  </Heading>
                  <Badge colorScheme={getCustomerStatusColor(customer.status)} size="sm">
                    {customer.status}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {customer.contactInfo.primaryContact}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {customer.companyName}
                </Text>
                <HStack spacing={2}>
                  <Badge
                    colorScheme={getCustomerTypeColor(customer.customerType)}
                    variant="subtle"
                    size="sm"
                  >
                    <HStack spacing={1}>
                      <Icon as={getCustomerTypeIcon(customer.customerType)} boxSize={3} />
                      {getCustomerTypeLabel(customer.customerType)}
                    </HStack>
                  </Badge>
                  <Badge
                    colorScheme={getCustomerTierColor(customer.classification.tier)}
                    variant="subtle"
                    size="sm"
                  >
                    {customer.classification.tier}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>

            <Divider />

            <VStack spacing={2} align="stretch">
              <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase">
                Contact
              </Text>
              {customer.contactInfo.email && (
                <HStack spacing={2} fontSize="sm">
                  <Icon as={FiMail} boxSize={3} color="gray.400" />
                  <Text color="blue.600" noOfLines={1}>
                    {customer.contactInfo.email}
                  </Text>
                </HStack>
              )}
              {customer.contactInfo.phone && (
                <HStack spacing={2} fontSize="sm">
                  <Icon as={FiPhone} boxSize={3} color="gray.400" />
                  <Text color="gray.700" noOfLines={1}>
                    {customer.contactInfo.phone}
                  </Text>
                </HStack>
              )}
              {customer.contactInfo.website && (
                <HStack spacing={2} fontSize="sm">
                  <Icon as={FiGlobe} boxSize={3} color="gray.400" />
                  <Text color="blue.600" noOfLines={1}>
                    {customer.contactInfo.website}
                  </Text>
                </HStack>
              )}
            </VStack>

            <VStack spacing={2} align="stretch">
              <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase">
                Business
              </Text>
              <HStack spacing={2} fontSize="sm">
                <Icon as={FiCreditCard} boxSize={3} color="gray.400" />
                <Text color="gray.700">
                  Credit: ${customer.businessInfo.creditLimit.toLocaleString()}
                </Text>
              </HStack>
              <HStack spacing={2} fontSize="sm">
                <Icon as={FiTruck} boxSize={3} color="gray.400" />
                <Text color="gray.700">Terms: {customer.businessInfo.paymentTerms}</Text>
              </HStack>
              <HStack spacing={2} fontSize="sm">
                <Icon as={FiHome} boxSize={3} color="gray.400" />
                <Text color="gray.700">Industry: {customer.classification.industry}</Text>
              </HStack>
              <HStack spacing={2} fontSize="sm">
                <Icon as={FiPackage} boxSize={3} color="gray.400" />
                <Text color="gray.700">Segment: {customer.classification.segment}</Text>
              </HStack>
            </VStack>

            {props.showAddresses && (
              <VStack spacing={2} align="stretch">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  textTransform="uppercase"
                >
                  Addresses
                </Text>
                <Box fontSize="sm">
                  <Text fontWeight="medium" color="gray.700">
                    Billing:
                  </Text>
                  <Text color="gray.600">
                    {customer.addresses.billing.street}, {customer.addresses.billing.city},{" "}
                    {customer.addresses.billing.state} {customer.addresses.billing.zipCode}
                  </Text>
                </Box>
                <Box fontSize="sm">
                  <Text fontWeight="medium" color="gray.700">
                    Shipping:
                  </Text>
                  <Text color="gray.600">
                    {customer.addresses.shipping.street}, {customer.addresses.shipping.city},{" "}
                    {customer.addresses.shipping.state} {customer.addresses.shipping.zipCode}
                  </Text>
                </Box>
              </VStack>
            )}

            {props.showActions && (
              <VStack spacing={2} align="stretch">
                <Divider />
                <HStack spacing={3} justify="center">
                  <Button size="sm" variant="outline" leftIcon={<Icon as={FiMail} />}>
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Icon as={FiHome} />}>
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Icon as={FiCreditCard} />}>
                    Credit Info
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}

// Customer Grid Component
function CustomerGridRenderer({ props }: { props: Record<string, any> }) {
  return (
    <Box p={4}>
      <Card shadow="sm">
        <CardBody p={4}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Heading size="md">Customer Directory</Heading>
              <Button size="sm" leftIcon={<Icon as={FiRefreshCw} />}>
                Refresh
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.600">
              Customer grid component - would display {props.pageSize || 10} customers per page
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}

// Customer Form Component
function CustomerFormRenderer({ props }: { props: Record<string, any> }) {
  return (
    <Box p={4}>
      <Card shadow="sm">
        <CardBody p={4}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Heading size="md">
                {props.mode === "create" ? "Create New Customer" : "Edit Customer"}
              </Heading>
              <Badge colorScheme="blue" variant="subtle">
                {props.template} Template
              </Badge>
            </HStack>

            <Text fontSize="sm" color="gray.600">
              Customer form component - would show form fields based on {props.customerType} type
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}

// Helper functions
function getCustomerTypeIcon(type: string) {
  switch (type) {
    case "retail":
      return FiHome;
    case "wholesale":
      return FiTruck;
    case "enterprise":
      return FiPackage;
    default:
      return FiHome;
  }
}

function getCustomerTypeColor(type: string) {
  switch (type) {
    case "retail":
      return "blue";
    case "wholesale":
      return "green";
    case "enterprise":
      return "purple";
    case "partner":
      return "orange";
    default:
      return "gray";
  }
}

function getCustomerTypeLabel(type: string) {
  switch (type) {
    case "retail":
      return "Retail";
    case "wholesale":
      return "Wholesale";
    case "enterprise":
      return "Enterprise";
    case "partner":
      return "Partner";
    default:
      return "Customer";
  }
}

function getCustomerStatusColor(status: string) {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "red";
    case "pending":
      return "yellow";
    case "suspended":
      return "orange";
    default:
      return "gray";
  }
}

function getCustomerTierColor(tier: string) {
  switch (tier) {
    case "platinum":
      return "purple";
    case "gold":
      return "yellow";
    case "silver":
      return "gray";
    case "bronze":
      return "orange";
    default:
      return "gray";
  }
}

export default InlineContentEditor;
