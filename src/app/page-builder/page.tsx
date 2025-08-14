"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useToast,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { FiPlus, FiSave, FiDownload, FiUpload, FiSearch, FiUsers } from "react-icons/fi";
import { ComponentGallery } from "../../components/puck/ComponentGallery";
import { InlineContentEditor, InlineContentData } from "../../components/puck/InlineContentEditor";
import { CustomerCard } from "../../components/puck/CustomerCard";
import { getCustomers } from "../../data/customers";

export default function PageBuilder() {
  const [isEditing, setIsEditing] = useState(false);
  const [pageData, setPageData] = useState<InlineContentData>({
    sections: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState(getCustomers()[0]);
  const [displayMode, setDisplayMode] = useState<"compact" | "detailed" | "full">("detailed");
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(true);
  const [showAddresses, setShowAddresses] = useState(false);
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Page saved successfully",
      status: "success",
      duration: 3000,
    });
  };

  const handleComponentSelect = (component: any) => {
    toast({
      title: "Selected",
      description: `${component.name} is now available`,
      status: "info",
      duration: 3000,
    });
  };

  const handleDataChange = (newData: InlineContentData) => {
    setPageData(newData);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(pageData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "century-360-page.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exported",
        description: "Page exported successfully",
        status: "success",
        duration: 3000,
      });
    } catch {
      toast({
        title: "Failed",
        description: "Export failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setPageData(importedData);
        toast({
          title: "Imported",
          description: "Page imported successfully",
          status: "success",
          duration: 3000,
        });
      } catch {
        toast({
          title: "Failed",
          description: "Invalid file format",
          status: "error",
          duration: 3000,
        });
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = "";
  };

  const sectionCount = pageData.sections?.length || 0;

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="7xl" mx="auto" py={8} px={4}>
        <VStack spacing={8} align="stretch">
          {/* Simple Header */}
          <Box>
            <VStack spacing={4} align="start">
              <Heading size="2xl" color="blue.600">
                Page Builder
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Create your pages with our simple builder
              </Text>
            </VStack>
          </Box>

          {/* Simple Action Bar */}
          <Box>
            <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
              <HStack spacing={4}>
                <Button
                  leftIcon={<Icon as={FiPlus} />}
                  colorScheme="blue"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Exit Edit" : "Start Building"}
                </Button>
                <Badge colorScheme="blue" variant="subtle" fontSize="md">
                  {sectionCount} section{sectionCount !== 1 ? "s" : ""}
                </Badge>
              </HStack>

              <HStack spacing={3}>
                <Button leftIcon={<Icon as={FiSave} />} variant="outline" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  leftIcon={<Icon as={FiDownload} />}
                  variant="outline"
                  onClick={handleExport}
                >
                  Export
                </Button>
                <Button
                  leftIcon={<Icon as={FiUpload} />}
                  variant="outline"
                  as="label"
                  htmlFor="page-import"
                  cursor="pointer"
                >
                  Import
                </Button>
                <input
                  id="page-import"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: "none" }}
                />
              </HStack>
            </HStack>
          </Box>

          {/* Main Content */}
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Page Builder</Tab>
              <Tab>Components</Tab>
              <Tab>Customer Card Demo</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <InlineContentEditor
                  data={pageData}
                  onDataChange={handleDataChange}
                  onSave={handleSave}
                  isEditing={isEditing}
                />
              </TabPanel>

              <TabPanel>
                <ComponentGallery
                  onComponentSelect={handleComponentSelect}
                  enableDragAndDrop={false}
                  showAddButton={false}
                />
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Heading size="lg" mb={4}>
                      Customer Card Demo
                    </Heading>
                    <Text color="gray.600" mb={6}>
                      This demonstrates the enhanced customer card functionality that matches the
                      Puck editor demo interface.
                    </Text>
                  </Box>

                  <HStack spacing={8} align="start">
                    {/* Configuration Panel */}
                    <Card flex={1}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Heading size="md">Edit customer-card</Heading>

                          <FormControl>
                            <FormLabel>Select Customer to Display</FormLabel>
                            <InputGroup>
                              <Input
                                placeholder="Search customers..."
                                value={selectedCustomer.name}
                                onChange={e => {
                                  const customers = getCustomers();
                                  const found = customers.find(c =>
                                    c.name.toLowerCase().includes(e.target.value.toLowerCase())
                                  );
                                  if (found) setSelectedCustomer(found);
                                }}
                              />
                              <InputRightElement>
                                <Icon as={FiSearch} color="gray.400" />
                              </InputRightElement>
                            </InputGroup>
                            <FormHelperText>
                            This will display the selected customer&apos;s information on your page.
                            </FormHelperText>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Display Mode</FormLabel>
                            <Select
                              value={displayMode}
                              onChange={e => setDisplayMode(e.target.value as any)}
                            >
                              <option value="compact">Compact</option>
                              <option value="detailed">Detailed (Full Profile)</option>
                              <option value="full">Full</option>
                            </Select>
                            <FormHelperText>
                              Choose how much customer information to show.
                            </FormHelperText>
                          </FormControl>

                          <Divider />

                          <VStack spacing={3} align="stretch">
                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Show Action Buttons</FormLabel>
                              <Switch
                                isChecked={showActionButtons}
                                onChange={e => setShowActionButtons(e.target.checked)}
                              />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Show Business Information</FormLabel>
                              <Switch
                                isChecked={showBusinessInfo}
                                onChange={e => setShowBusinessInfo(e.target.checked)}
                              />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                              <FormLabel mb="0">Show Addresses</FormLabel>
                              <Switch
                                isChecked={showAddresses}
                                onChange={e => setShowAddresses(e.target.checked)}
                              />
                            </FormControl>
                          </VStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Preview Panel */}
                    <Card flex={1}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Heading size="md">Preview</Heading>
                          <CustomerCard
                            customer={selectedCustomer}
                            displayMode={displayMode}
                            showActionButtons={showActionButtons}
                            showBusinessInfo={showBusinessInfo}
                            showAddresses={showAddresses}
                            showContacts={true}
                            showStats={true}
                            isEditable={true}
                          />
                        </VStack>
                      </CardBody>
                    </Card>
                  </HStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </Box>
  );
}
