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
  Badge,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Avatar,
  Icon,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { FiSearch, FiFilter, FiEye, FiEdit3, FiTrash2, FiDownload, FiUpload } from "react-icons/fi";
import { Customer, CustomerFilters, CustomerSort } from "../../types/customer";
import { getCustomers } from "../../data/customers";
import { CustomerCard } from "./CustomerCard";

interface CustomerDataTableProps {
  customers?: Customer[];
  showFilters?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  maxHeight?: string;
  onCustomerSelect?: (customer: Customer) => void;
  onCustomerEdit?: (customer: Customer) => void;
  onCustomerDelete?: (customer: Customer) => void;
}

export function CustomerDataTable({
  customers: propCustomers,
  showFilters = true,
  showSearch = true,
  showActions = true,
  showPagination = true,
  pageSize = 10,
  maxHeight = "600px",
  onCustomerSelect,
  onCustomerEdit,
  onCustomerDelete,
}: CustomerDataTableProps) {
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [sort, setSort] = useState<CustomerSort>({ field: "name", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

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
    setCurrentPage(1);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTierColor = (tier: string) => {
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "wholesale" ? "blue" : "teal";
  };

  return (
    <Box>
      {/* Controls */}
      {(showFilters || showSearch || showActions) && (
        <VStack spacing={4} mb={6} align="stretch">
          {/* Search and Actions */}
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
                <Tooltip label="Export Data">
                  <IconButton
                    aria-label="Export data"
                    icon={<FiDownload />}
                    variant="outline"
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="Import Data">
                  <IconButton
                    aria-label="Import data"
                    icon={<FiUpload />}
                    variant="outline"
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
          Showing {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of{" "}
          {filteredCustomers.length} customers
        </Text>
        {getFilterCount() > 0 && (
          <Badge colorScheme="blue" variant="subtle">
            {getFilterCount()} filter{getFilterCount() !== 1 ? "s" : ""} applied
          </Badge>
        )}
      </HStack>

      {/* Data Table */}
      <Box overflowX="auto" maxH={maxHeight} overflowY="auto">
        <Table variant="simple" size="sm" w="full">
          {/* Table Header */}
          <Box as="thead" bg="gray.50" position="sticky" top={0} zIndex={1}>
            <Box as="tr">
              <Box
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
                Customer
              </Box>
              <Box
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
                Type
              </Box>
              <Box
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
                Status
              </Box>
              <Box
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
                Tier
              </Box>
              <Box
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
                Revenue
              </Box>
              <Box
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
                Orders
              </Box>
              <Box
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
                Last Order
              </Box>
              <Box
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
                Actions
              </Box>
            </Box>
          </Box>

          {/* Table Body */}
          <Box as="tbody">
            {paginatedCustomers.map(customer => (
              <Box
                as="tr"
                key={customer.id}
                _hover={{ bg: "gray.50" }}
                cursor="pointer"
                onClick={() => handleCustomerClick(customer)}
              >
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <HStack spacing={3}>
                    <Avatar size="sm" name={customer.name} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" fontSize="sm">
                        {customer.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {customer.industry}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Badge colorScheme={getTypeColor(customer.type)} size="sm">
                    {customer.type}
                  </Badge>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Badge colorScheme={getStatusColor(customer.status)} size="sm">
                    {customer.status}
                  </Badge>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Badge colorScheme={getTierColor(customer.tier)} size="sm">
                    {customer.tier}
                  </Badge>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" fontWeight="medium">
                    {formatCurrency(customer.totalRevenue)}
                  </Text>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Text fontSize="sm">{customer.totalOrders}</Text>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" color="gray.600">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "Never"}
                  </Text>
                </Box>
                <Box as="td" px={4} py={3} borderBottom="1px solid" borderColor="gray.200">
                  <HStack spacing={1}>
                    <Tooltip label="View Details">
                      <IconButton
                        aria-label="View customer details"
                        icon={<FiEye />}
                        size="xs"
                        variant="ghost"
                        onClick={e => {
                          e.stopPropagation();
                          handleCustomerClick(customer);
                        }}
                      />
                    </Tooltip>
                    {onCustomerEdit && (
                      <Tooltip label="Edit Customer">
                        <IconButton
                          aria-label="Edit customer"
                          icon={<FiEdit3 />}
                          size="xs"
                          variant="ghost"
                          onClick={e => {
                            e.stopPropagation();
                            onCustomerEdit(customer);
                          }}
                        />
                      </Tooltip>
                    )}
                    {onCustomerDelete && (
                      <Tooltip label="Delete Customer">
                        <IconButton
                          aria-label="Delete customer"
                          icon={<FiTrash2 />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={e => {
                            e.stopPropagation();
                            onCustomerDelete(customer);
                          }}
                        />
                      </Tooltip>
                    )}
                  </HStack>
                </Box>
              </Box>
            ))}
          </Box>
        </Table>
      </Box>

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

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <HStack justify="center" spacing={2} mt={6}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
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
