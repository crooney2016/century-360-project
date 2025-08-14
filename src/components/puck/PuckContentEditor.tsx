"use client";
import React, { useState, useCallback } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useToast,
  useColorModeValue,
  Badge,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { FiEye, FiEdit3, FiSave, FiDownload, FiUpload } from "react-icons/fi";
import puckConfig from "./PuckConfig.tsx";

export interface PuckContentData {
  content: any[];
  root: {
    props: {
      title: string;
    };
    children: any[];
  };
}

interface PuckContentEditorProps {
  data: PuckContentData;
  onDataChange: (data: PuckContentData) => void;
  onSave?: () => void;
  isEditing?: boolean;
}

export function PuckContentEditor({
  data,
  onDataChange,
  onSave,
  isEditing = true,
}: PuckContentEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handlePublish = useCallback(
    (puckData: any) => {
      onDataChange(puckData);
      toast({
        title: "Content saved",
        description: "Your content has been saved successfully",
        status: "success",
        duration: 3000,
      });
    },
    [onDataChange, toast]
  );

  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
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
        title: "Content exported",
        description: "Your content has been exported successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export content",
        status: "error",
        duration: 3000,
      });
    }
  }, [data, toast]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          onDataChange(importedData);
          toast({
            title: "Content imported",
            description: "Your content has been imported successfully",
            status: "success",
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Invalid file format",
            status: "error",
            duration: 3000,
          });
        }
      };
      reader.readAsText(file);

      // Reset the input
      event.target.value = "";
    },
    [onDataChange, toast]
  );

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  if (isPreviewMode) {
    return (
      <Box>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">Content Preview</Heading>
            <HStack spacing={3}>
              <Badge colorScheme="blue" variant="subtle">
                Preview Mode
              </Badge>
              <Button
                leftIcon={<Icon as={FiEdit3} />}
                colorScheme="blue"
                onClick={togglePreviewMode}
              >
                Edit Content
              </Button>
            </HStack>
          </HStack>

          <Box
            p={6}
            bg={bgColor}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            minH="400px"
          >
            <Text color="gray.500" textAlign="center" py={20}>
              Content preview will be rendered here when you have components added.
              <br />
              Switch to edit mode to start building your content.
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading size="lg">Visual Content Editor</Heading>
          <HStack spacing={3}>
            <Badge colorScheme="green" variant="subtle">
              Edit Mode
            </Badge>
            <Button leftIcon={<Icon as={FiEye} />} variant="outline" onClick={togglePreviewMode}>
              Preview
            </Button>
            {onSave && (
              <Button leftIcon={<Icon as={FiSave} />} colorScheme="blue" onClick={onSave}>
                Save
              </Button>
            )}
          </HStack>
        </HStack>

        <HStack spacing={3} justify="flex-end">
          <Tooltip label="Export content as JSON">
            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              Export
            </Button>
          </Tooltip>
          <Tooltip label="Import content from JSON file">
            <Button
              leftIcon={<Icon as={FiUpload} />}
              variant="outline"
              size="sm"
              as="label"
              htmlFor="content-import"
              cursor="pointer"
            >
              Import
            </Button>
          </Tooltip>
          <input
            id="content-import"
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </HStack>

        <Box
          border="1px solid"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
          minH="600px"
        >
          <Puck
            config={puckConfig}
            data={data}
            onPublish={handlePublish}
            showEditButton={false}
            showHeader={false}
          />
        </Box>

        <Box p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            <strong>Tip:</strong> Use the sidebar to drag and drop components, then edit their
            properties in the right panel. Your changes are automatically saved as you work.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default PuckContentEditor;
