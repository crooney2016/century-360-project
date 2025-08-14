"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Divider,
  Avatar,
  AvatarGroup,
  Tooltip,
  Input,
  Button,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiSearch,
  FiEdit3,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Customer } from "../../types/customer";
import { getCustomers } from "../../data/customers";

interface CustomerCardProps {
  customer?: Customer;
  customerId?: string;
  variant?: "default" | "compact" | "detailed";
  showContacts?: boolean;
  showAddresses?: boolean;
  showStats?: boolean;
  showActionButtons?: boolean;
  showBusinessInfo?: boolean;
  displayMode?: "compact" | "detailed" | "full";
  isEditable?: boolean;
  onCustomerChange?: (customer: Customer) => void;
}

export function CustomerCard({
  customer,
  customerId,
  variant = "default",
  showContacts = true,
  showAddresses = true,
  showStats = true,
  showActionButtons = false,
  showBusinessInfo = true,
  displayMode = "detailed",
  isEditable = false,
  onCustomerChange,
}: CustomerCardProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(customer);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Load customer data if customerId is provided
  useEffect(() => {
    if (customerId && !customer) {
      const customers = getCustomers();
      const foundCustomer = customers.find(c => c.id === customerId);
      if (foundCustomer) {
        setSelectedCustomer(foundCustomer);
      }
    } else if (customer) {
      setSelectedCustomer(customer);
    }
  }, [customerId, customer]);

  // Filter customers for search
  useEffect(() => {
    if (searchTerm) {
      const customers = getCustomers();
      const filtered = customers.filter(
        c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.contacts.some(
            contact =>
              contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              contact.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm]);

  const handleCustomerSelect = (selectedCustomer: Customer) => {
    setSelectedCustomer(selectedCustomer);
    setSearchTerm("");
    setFilteredCustomers([]);
    onCustomerChange?.(selectedCustomer);
    onClose();
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

  // If no customer is selected, show placeholder
  if (!selectedCustomer) {
    return (
      <Card border="1px solid" borderColor={borderColor} bg={bgColor} shadow="sm">
        <CardBody p={4}>
          <VStack spacing={4} align="center">
            <Icon as={FiUsers} boxSize={8} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              {isEditable ? "Select a customer to display" : "No customer selected"}
            </Text>
            {isEditable && (
              <Button
                leftIcon={<Icon as={FiSearch} />}
                colorScheme="blue"
                size="sm"
                onClick={onOpen}
              >
                Select Customer
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Compact variant
  if (variant === "compact" || displayMode === "compact") {
    return (
      <Card
        size="sm"
        cursor="pointer"
        _hover={{ shadow: "md" }}
        border="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        <CardBody p={3}>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                {selectedCustomer.name}
              </Text>
              <HStack spacing={2}>
                <Badge size="sm" colorScheme={getTypeColor(selectedCustomer.type)}>
                  {selectedCustomer.type}
                </Badge>
                <Badge size="sm" colorScheme={getStatusColor(selectedCustomer.status)}>
                  {selectedCustomer.status}
                </Badge>
              </HStack>
            </VStack>
            <Badge size="sm" colorScheme={getTierColor(selectedCustomer.tier)}>
              {selectedCustomer.tier}
            </Badge>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card
        cursor="pointer"
        _hover={{ shadow: "lg" }}
        transition="all 0.2s"
        border="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        <CardBody p={4}>
          <VStack align="stretch" spacing={3}>
            {/* Header */}
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={1} flex={1}>
                <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                  {selectedCustomer.name}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {selectedCustomer.industry}
                </Text>
              </VStack>
              <VStack align="end" spacing={1}>
                <Badge colorScheme={getTierColor(selectedCustomer.tier)}>
                  {selectedCustomer.tier}
                </Badge>
                <Badge colorScheme={getStatusColor(selectedCustomer.status)}>
                  {selectedCustomer.status}
                </Badge>
              </VStack>
            </HStack>

            {/* Type Badge */}
            <HStack spacing={2}>
              <Badge colorScheme={getTypeColor(selectedCustomer.type)}>
                {selectedCustomer.type}
              </Badge>
              {selectedCustomer.website && (
                <HStack spacing={1} color="blue.500">
                  <Icon as={FiGlobe} boxSize={3} />
                  <Text fontSize="xs">Website</Text>
                </HStack>
              )}
            </HStack>

            {/* Stats Row */}
            {showStats && (
              <HStack justify="space-between" bg="gray.50" p={2} borderRadius="md">
                <VStack spacing={1} align="center">
                  <Icon as={FiDollarSign} color="green.500" />
                  <Text fontSize="xs" color="gray.600">
                    Revenue
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {formatCurrency(selectedCustomer.totalRevenue)}
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={FiPackage} color="blue.500" />
                  <Text fontSize="xs" color="gray.600">
                    Orders
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {selectedCustomer.totalOrders}
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={FiUsers} color="purple.500" />
                  <Text fontSize="xs" color="gray.600">
                    Contacts
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    {selectedCustomer.contacts.length}
                  </Text>
                </VStack>
              </HStack>
            )}

            {/* Business Information */}
            {showBusinessInfo && (
              <>
                <Divider />
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Business Information
                  </Text>
                  <HStack justify="space-between" fontSize="sm">
                    <Text color="gray.600">Credit Limit:</Text>
                    <Text fontWeight="medium">
                      {formatCurrency(selectedCustomer.creditLimit || 0)}
                    </Text>
                  </HStack>
                  <HStack justify="space-between" fontSize="sm">
                    <Text color="gray.600">Payment Terms:</Text>
                    <Text fontWeight="medium">Net 30</Text>
                  </HStack>
                </VStack>
              </>
            )}

            {/* Contacts */}
            {showContacts && selectedCustomer.contacts.length > 0 && (
              <>
                <Divider />
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Primary Contact
                  </Text>
                  {selectedCustomer.contacts
                    .filter(c => c.isPrimary)
                    .map(contact => (
                      <HStack key={contact.id} spacing={2}>
                        <Avatar size="xs" name={contact.name} />
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {contact.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {contact.role}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={0}>
                          <HStack spacing={1} color="blue.500">
                            <Icon as={FiMail} boxSize={3} />
                            <Text fontSize="xs">{contact.email}</Text>
                          </HStack>
                          <HStack spacing={1} color="green.500">
                            <Icon as={FiPhone} boxSize={3} />
                            <Text fontSize="xs">{contact.phone}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    ))}
                </VStack>
              </>
            )}

            {/* Addresses */}
            {showAddresses && selectedCustomer.addresses.length > 0 && (
              <>
                <Divider />
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Primary Address
                  </Text>
                  {selectedCustomer.addresses
                    .filter(a => a.isDefault)
                    .map(address => (
                      <HStack key={address.id} spacing={2}>
                        <Icon as={FiMapPin} color="red.500" boxSize={4} />
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm">{address.street}</Text>
                          <Text fontSize="xs" color="gray.600">
                            {address.city}, {address.state} {address.zipCode}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {address.country}
                          </Text>
                        </VStack>
                        <Badge size="sm" colorScheme="blue">
                          {address.type}
                        </Badge>
                      </HStack>
                    ))}
                </VStack>
              </>
            )}

            {/* Action Buttons */}
            {showActionButtons && (
              <>
                <Divider />
                <HStack spacing={2} justify="center">
                  <Button size="sm" colorScheme="blue" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" colorScheme="green" variant="outline">
                    Edit Customer
                  </Button>
                </HStack>
              </>
            )}

            {/* Footer */}
            <Divider />
            <HStack justify="space-between" fontSize="xs" color="gray.500">
              <Text>Created: {formatDate(selectedCustomer.createdAt)}</Text>
              {selectedCustomer.lastOrderDate && (
                <Text>Last Order: {formatDate(selectedCustomer.lastOrderDate)}</Text>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Customer Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Customer to Display</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Search Customers</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Search by name, company, or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <InputRightElement>
                    <Icon as={FiSearch} color="gray.400" />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  This will display the selected customer&apos;s information on your page.
                </FormHelperText>
              </FormControl>

              {filteredCustomers.length > 0 && (
                <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
                  {filteredCustomers.map(customer => (
                    <Box
                      key={customer.id}
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: "gray.50" }}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{customer.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {customer.industry} • {customer.type}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {customer.contacts.find(c => c.isPrimary)?.email || "No email"}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}

              {searchTerm && filteredCustomers.length === 0 && (
                <Text color="gray.500" textAlign="center" py={4}>
                  No customers found matching &quot;{searchTerm}&quot;
                </Text>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
