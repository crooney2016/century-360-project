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
} from "@chakra-ui/react";
import { FiPlus, FiSave, FiDownload, FiUpload } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { ComponentGallery } from "../../components/puck/ComponentGallery";
import { InlineContentEditor, InlineContentData } from "../../components/puck/InlineContentEditor";

export default function Content360() {
  const [isEditing, setIsEditing] = useState(false);
  const [contentData, setContentData] = useState<InlineContentData>({
    sections: [],
  });
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Content saved successfully",
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
    setContentData(newData);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(contentData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "century-360-content.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exported",
        description: "Content exported successfully",
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
        setContentData(importedData);
        toast({
          title: "Imported",
          description: "Content imported successfully",
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

  const sectionCount = contentData.sections?.length || 0;

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="7xl" mx="auto" py={8} px={4}>
        <VStack spacing={8} align="stretch">
          {/* Simple Header */}
          <Box>
            <VStack spacing={4} align="start">
              <Heading size="2xl" color="blue.600">
                Content 360°
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Build your content with our simple page builder
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
                  htmlFor="content-import"
                  cursor="pointer"
                >
                  Import
                </Button>
                <input
                  id="content-import"
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
            </TabList>

            <TabPanels>
              <TabPanel>
                <InlineContentEditor
                  data={contentData}
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
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </Box>
  );
}
