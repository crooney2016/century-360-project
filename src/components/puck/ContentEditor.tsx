"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  IconButton,
  useToast,
  useColorModeValue,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  Badge,
  Icon,
  Tooltip,
  useDisclosure,
  Collapse,
  Flex,
  Spacer,
  Divider,
  useDisclosure as useCollapse,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiTrash2,
  FiEdit3,
  FiEye,
  /* FiSettings, */
  FiChevronDown,
  FiChevronRight,
  FiMove,
  FiCopy,
} from "react-icons/fi";
import { ComponentExample } from "./ComponentGallery";

export interface ContentComponent {
  id: string;
  componentId: string;
  name: string;
  category: string;
  props: Record<string, any>;
  order: number;
}

interface ContentEditorProps {
  components: ContentComponent[];
  onComponentsChange: (components: ContentComponent[]) => void;
  onSave?: () => void;
  isEditing?: boolean;
}

export function ContentEditor({
  components,
  onComponentsChange,
  onSave,
  isEditing = true,
}: ContentEditorProps) {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const dropZoneBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      try {
        const data = JSON.parse(event.dataTransfer.getData("application/json"));
        if (data.type === "component") {
          const newComponent: ContentComponent = {
            id: `${data.component.id}-${Date.now()}`,
            componentId: data.component.id,
            name: data.component.name,
            category: data.component.category,
            props: data.component.props || {},
            order: components.length,
          };

          onComponentsChange([...components, newComponent]);
          toast({
            title: "Component added",
            description: `${data.component.name} has been added to your content`,
            status: "success",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error parsing dropped component:", error);
      }
    },
    [components, onComponentsChange, toast]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleComponentUpdate = useCallback(
    (componentId: string, updates: Partial<ContentComponent>) => {
      const updatedComponents = components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      );
      onComponentsChange(updatedComponents);
    },
    [components, onComponentsChange]
  );

  const handleComponentDelete = useCallback(
    (componentId: string) => {
      const updatedComponents = components.filter(comp => comp.id !== componentId);
      onComponentsChange(updatedComponents);
      setExpandedComponent(null);
      setEditingComponent(null);
      toast({
        title: "Component removed",
        description: "Component has been removed from your content",
        status: "info",
        duration: 3000,
      });
    },
    [components, onComponentsChange, toast]
  );

  const handleComponentReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updatedComponents = [...components];
      const [movedComponent] = updatedComponents.splice(fromIndex, 1);
      updatedComponents.splice(toIndex, 0, movedComponent);

      // Update order property
      updatedComponents.forEach((comp, index) => {
        comp.order = index;
      });

      onComponentsChange(updatedComponents);
    },
    [components, onComponentsChange]
  );

  const toggleComponentExpansion = (componentId: string) => {
    setExpandedComponent(expandedComponent === componentId ? null : componentId);
  };

  const toggleComponentEditing = (componentId: string) => {
    setEditingComponent(editingComponent === componentId ? null : componentId);
  };

  const renderComponentPreview = (component: ContentComponent) => {
    // Enhanced component rendering based on type
    if (component.componentId === "hero-section") {
      return (
        <Box
          p={component.props.padding || 8}
          bg={component.props.backgroundColor || "blue.500"}
          color={component.props.textColor || "white"}
          borderRadius="lg"
          textAlign="center"
          minH="120px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={4}>
            {component.props.title && <Heading size="2xl">{component.props.title}</Heading>}
            {component.props.subtitle && (
              <Text fontSize="xl" opacity={0.9}>
                {component.props.subtitle}
              </Text>
            )}
          </VStack>
        </Box>
      );
    }

    if (component.componentId === "text-block") {
      return (
        <Box p={4}>
          {component.props.title && (
            <Heading size="md" mb={3} color={component.props.color || "gray.800"}>
              {component.props.title}
            </Heading>
          )}
          {component.props.text && (
            <Text
              fontSize={component.props.fontSize || "md"}
              fontWeight={component.props.fontWeight || "normal"}
              textAlign={component.props.textAlign || "left"}
              color={component.props.color || "gray.800"}
            >
              {component.props.text}
            </Text>
          )}
        </Box>
      );
    }

    if (component.componentId === "content-grid") {
      return (
        <Box p={4}>
          <SimpleGrid columns={component.props.columns || 3} spacing={component.props.spacing || 4}>
            {(component.props.items || ["Content 1", "Content 2", "Content 3"]).map(
              (item: string, i: number) => (
                <Box key={i} bg="gray.100" p={4} borderRadius="md" textAlign="center">
                  {item}
                </Box>
              )
            )}
          </SimpleGrid>
        </Box>
      );
    }

    // Default fallback
    return (
      <Box
        p={4}
        bg={component.props.backgroundColor || "gray.100"}
        color={component.props.textColor || "gray.800"}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        minH="80px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={2} align="center">
          <Text fontWeight="semibold">{component.name}</Text>
          <Text fontSize="sm" color="gray.500">
            {component.category} component
          </Text>
        </VStack>
      </Box>
    );
  };

  const renderInlinePropertyEditor = (component: ContentComponent) => {
    const renderField = (key: string, value: any) => {
      if (typeof value === "string") {
        if (key.includes("color")) {
          return (
            <FormControl key={key} size="sm">
              <FormLabel fontSize="xs" mb={1}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              </FormLabel>
              <Input
                value={value}
                onChange={e =>
                  handleComponentUpdate(component.id, {
                    props: { ...component.props, [key]: e.target.value },
                  })
                }
                placeholder={`Enter ${key}`}
                size="sm"
                fontSize="sm"
              />
            </FormControl>
          );
        } else if (key.includes("text") || key.includes("title") || key.includes("subtitle")) {
          return (
            <FormControl key={key} size="sm">
              <FormLabel fontSize="xs" mb={1}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              </FormLabel>
              <Textarea
                value={value}
                onChange={e =>
                  handleComponentUpdate(component.id, {
                    props: { ...component.props, [key]: e.target.value },
                  })
                }
                placeholder={`Enter ${key}`}
                rows={key.includes("text") ? 2 : 1}
                size="sm"
                fontSize="sm"
              />
            </FormControl>
          );
        } else {
          return (
            <FormControl key={key} size="sm">
              <FormLabel fontSize="xs" mb={1}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              </FormLabel>
              <Input
                value={value}
                onChange={e =>
                  handleComponentUpdate(component.id, {
                    props: { ...component.props, [key]: e.target.value },
                  })
                }
                placeholder={`Enter ${key}`}
                size="sm"
                fontSize="sm"
              />
            </FormControl>
          );
        }
      } else if (typeof value === "number") {
        return (
          <FormControl key={key} size="sm">
            <FormLabel fontSize="xs" mb={1}>
              {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
            </FormLabel>
            <NumberInput
              value={value}
              onChange={(_, newValue) =>
                handleComponentUpdate(component.id, {
                  props: { ...component.props, [key]: newValue },
                })
              }
              min={0}
              max={100}
              size="sm"
            >
              <NumberInputField fontSize="sm" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        );
      } else if (typeof value === "boolean") {
        return (
          <FormControl key={key} display="flex" alignItems="center" size="sm">
            <FormLabel htmlFor={key} mb="0" fontSize="xs">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
            </FormLabel>
            <Switch
              id={key}
              isChecked={value}
              onChange={e =>
                handleComponentUpdate(component.id, {
                  props: { ...component.props, [key]: e.target.checked },
                })
              }
              size="sm"
            />
          </FormControl>
        );
      }
      return null;
    };

    return (
      <Collapse in={editingComponent === component.id} animateOpacity>
        <Box bg="gray.50" p={4} borderRadius="md" border="1px solid" borderColor="gray.200" mt={3}>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Properties
              </Text>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => toggleComponentEditing(component.id)}
              >
                Done
              </Button>
            </HStack>
            <Divider />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {Object.entries(component.props).map(([key, value]) => renderField(key, value))}
            </SimpleGrid>
          </VStack>
        </Box>
      </Collapse>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Drop Zone */}
      {isEditing && (
        <Box
          minH="120px"
          bg={dropZoneBg}
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="lg"
          p={6}
          textAlign="center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          _hover={{ borderColor: "blue.400", bg: "blue.50" }}
          transition="all 0.2s"
        >
          <VStack spacing={3}>
            <Icon as={FiMove} boxSize={6} color="gray.400" />
            <Heading size="md" color="gray.600">
              Drop components here
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Drag components from the gallery to start building your content
            </Text>
          </VStack>
        </Box>
      )}

      {/* Content Components */}
      {components.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Content Components ({components.length})</Heading>
            {onSave && (
              <Button colorScheme="blue" size="sm" onClick={onSave}>
                Save Content
              </Button>
            )}
          </HStack>

          {components.map((component, index) => (
            <Card
              key={component.id}
              border="1px solid"
              borderColor={borderColor}
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <CardHeader pb={3}>
                <HStack justify="space-between">
                  <HStack spacing={3} flex={1}>
                    <Icon as={FiMove} color="gray.400" cursor="grab" />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack spacing={3} align="center">
                        <Text fontWeight="semibold">{component.name}</Text>
                        <Badge colorScheme="blue" variant="subtle" size="sm">
                          {component.category}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Click to expand • Drag to reorder
                      </Text>
                    </VStack>
                  </HStack>
                  <HStack spacing={2}>
                    <Tooltip label="Expand/Collapse">
                      <IconButton
                        aria-label="Toggle component expansion"
                        icon={
                          expandedComponent === component.id ? (
                            <FiChevronDown />
                          ) : (
                            <FiChevronRight />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleComponentExpansion(component.id)}
                      />
                    </Tooltip>
                    <Tooltip label="Edit properties">
                      <IconButton
                        aria-label="Edit component properties"
                        icon={<FiEdit3 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleComponentEditing(component.id)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete component">
                      <IconButton
                        aria-label="Delete component"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleComponentDelete(component.id)}
                      />
                    </Tooltip>
                  </HStack>
                </HStack>
              </CardHeader>

              {/* Component Preview - Always Visible */}
              <CardBody pt={0}>{renderComponentPreview(component)}</CardBody>

              {/* Expandable Properties Section */}
              <Collapse in={expandedComponent === component.id} animateOpacity>
                <Box p={4} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" align="center">
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        Component Details
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => toggleComponentExpansion(component.id)}
                      >
                        Collapse
                      </Button>
                    </HStack>

                    {/* Quick Property Summary */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                      {Object.entries(component.props)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <Box
                            key={key}
                            p={2}
                            bg="white"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, str => str.toUpperCase())}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium">
                              {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                            </Text>
                          </Box>
                        ))}
                    </SimpleGrid>

                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        variant="outline"
                        leftIcon={<FiEdit3 />}
                        onClick={() => toggleComponentEditing(component.id)}
                      >
                        Edit Properties
                      </Button>
                      <Button size="xs" variant="outline" leftIcon={<FiCopy />}>
                        Duplicate
                      </Button>
                      <Button size="xs" variant="outline" leftIcon={<FiMove />}>
                        Move
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </Collapse>

              {/* Inline Property Editor */}
              {renderInlinePropertyEditor(component)}
            </Card>
          ))}
        </VStack>
      ) : (
        <Card>
          <CardBody>
            <VStack spacing={4} align="center" py={8}>
              <Icon as={FiEdit3} boxSize={8} color="gray.400" />
              <Text fontSize="lg" color="gray.500">
                No components added yet
              </Text>
              <Text color="gray.400" textAlign="center">
                Drag components from the gallery to start building your content
              </Text>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}
