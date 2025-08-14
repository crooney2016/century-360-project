"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack as ChakraHStack,
  SimpleGrid,
  Badge,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FiGrid, FiList, FiFilter, FiSearch, FiPlus, FiEdit3, FiEye } from "react-icons/fi";
import { CustomerCard } from "./CustomerCard";
import { Customer, CustomerFilters, CustomerSort } from "../../types/customer";
import { getCustomers } from "../../data/customers";

interface CustomerGridProps {
  customers?: Customer[];
  displayMode?: "grid" | "list";
  columns?: number;
  gap?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  maxHeight?: string;
  onCustomerSelect?: (customer: Customer) => void;
}

export function CustomerGrid({
  customers: propCustomers,
  displayMode = "grid",
  columns = 3,
  gap = 6,
  showFilters = true,
  showSearch = true,
  showActions = true,
  maxHeight = "auto",
  onCustomerSelect,
}: CustomerGridProps) {
  const [displayModeState, setDisplayModeState] = useState(displayMode);
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [sort, setSort] = useState<CustomerSort>({ field: "name", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const toast = useToast();

  // Get customers from props or use demo data
  const allCustomers = propCustomers || getCustomers();

  // Apply filters and search
  const filteredCustomers = useMemo(() => {
    let filtered = [...allCustomers];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        customer =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.contacts.some(
            contact =>
              contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              contact.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(customer => customer.type === filters.type);
    }
    if (filters.status) {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }
    if (filters.tier) {
      filtered = filtered.filter(customer => customer.tier === filters.tier);
    }
    if (filters.industry) {
      filtered = filtered.filter(customer => customer.industry === filters.industry);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "tier":
          aValue = a.tier;
          bValue = b.tier;
          break;
        case "totalRevenue":
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case "lastOrderDate":
          aValue = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
          bValue = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allCustomers, filters, sort, searchTerm]);

  const handleCustomerClick = (customer: Customer) => {
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    } else {
      setSelectedCustomer(customer);
      onOpen();
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setSort({ field: "name", direction: "asc" });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.type) count++;
    if (filters.status) count++;
    if (filters.tier) count++;
    if (filters.industry) count++;
    if (searchTerm) count++;
    return count;
  };

  return (
    <Box>
      {/* Controls */}
      {(showFilters || showSearch || showActions) && (
        <VStack spacing={4} mb={6} align="stretch">
          {/* Search and Display Mode */}
          <HStack justify="space-between" align="center">
            {showSearch && (
              <HStack flex={1} maxW="400px">
                <InputGroup>
                  <Input
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <InputLeftElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputLeftElement>
                </InputGroup>
              </HStack>
            )}

            {showActions && (
              <HStack spacing={2}>
                <Tooltip label="Grid View">
                  <IconButton
                    aria-label="Grid view"
                    icon={<FiGrid />}
                    variant={displayModeState === "grid" ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => setDisplayModeState("grid")}
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="List View">
                  <IconButton
                    aria-label="List view"
                    icon={<FiList />}
                    variant={displayModeState === "list" ? "solid" : "outline"}
                    colorScheme="blue"
                    onClick={() => setDisplayModeState("list")}
                    size="sm"
                  />
                </Tooltip>
              </HStack>
            )}
          </HStack>

          {/* Filters */}
          {showFilters && (
            <Box>
              <HStack spacing={4} wrap="wrap">
                <Select
                  placeholder="Customer Type"
                  value={filters.type || ""}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, type: (e.target.value as any) || undefined }))
                  }
                  size="sm"
                  maxW="150px"
                >
                  <option value="wholesale">Wholesale</option>
                  <option value="retail">Retail</option>
                </Select>

                <Select
                  placeholder="Status"
                  value={filters.status || ""}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, status: (e.target.value as any) || undefined }))
                  }
                  size="sm"
                  maxW="150px"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </Select>

                <Select
                  placeholder="Tier"
                  value={filters.tier || ""}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, tier: (e.target.value as any) || undefined }))
                  }
                  size="sm"
                  maxW="150px"
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </Select>

                <Select
                  placeholder="Industry"
                  value={filters.industry || ""}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, industry: e.target.value || undefined }))
                  }
                  size="sm"
                  maxW="150px"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                </Select>

                <Select
                  placeholder="Sort By"
                  value={`${sort.field}-${sort.direction}`}
                  onChange={e => {
                    const [field, direction] = e.target.value.split("-");
                    setSort({ field: field as any, direction: direction as any });
                  }}
                  size="sm"
                  maxW="150px"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="totalRevenue-desc">Revenue (High-Low)</option>
                  <option value="totalRevenue-asc">Revenue (Low-High)</option>
                  <option value="lastOrderDate-desc">Last Order (Recent)</option>
                  <option value="createdAt-desc">Created (Recent)</option>
                </Select>

                {getFilterCount() > 0 && (
                  <Button size="sm" variant="ghost" onClick={clearFilters}>
                    Clear Filters ({getFilterCount()})
                  </Button>
                )}
              </HStack>
            </Box>
          )}
        </VStack>
      )}

      {/* Results Count */}
      <HStack justify="space-between" mb={4}>
        <Text color="gray.600" fontSize="sm">
          Showing {filteredCustomers.length} of {allCustomers.length} customers
        </Text>
        {getFilterCount() > 0 && (
          <Badge colorScheme="blue" variant="subtle">
            {getFilterCount()} filter{getFilterCount() !== 1 ? "s" : ""} applied
          </Badge>
        )}
      </HStack>

      {/* Customer Grid/List */}
      {displayModeState === "grid" ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: columns }} spacing={gap}>
          {filteredCustomers.map(customer => (
            <Box key={customer.id} onClick={() => handleCustomerClick(customer)}>
              <CustomerCard customer={customer} variant="default" />
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <VStack spacing={3} align="stretch">
          {filteredCustomers.map(customer => (
            <Box key={customer.id} onClick={() => handleCustomerClick(customer)}>
              <CustomerCard customer={customer} variant="compact" />
            </Box>
          ))}
        </VStack>
      )}

      {/* No Results */}
      {filteredCustomers.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg">
            No customers found matching your criteria
          </Text>
          <Button mt={4} onClick={clearFilters}>
            Clear all filters
          </Button>
        </Box>
      )}

      {/* Customer Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Customer Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedCustomer && (
              <CustomerCard
                customer={selectedCustomer}
                variant="detailed"
                showContacts={true}
                showAddresses={true}
                showStats={true}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
