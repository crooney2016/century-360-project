"use client";
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  IconButton,
  Tooltip,
  Flex,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiGrid, FiList, FiEye, /* FiCode, FiCopy, */ FiPlus, FiMove } from "react-icons/fi";
import { ComponentExample } from "./ComponentGallery";

interface Category {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ComponentGalleryClientProps {
  componentExamples: ComponentExample[];
  categories: Category[];
  onComponentSelect?: (component: ComponentExample) => void;
  onComponentDragStart?: (component: ComponentExample, event: React.DragEvent) => void;
  showAddButton?: boolean;
  enableDragAndDrop?: boolean;
}

export function ComponentGalleryClient({
  componentExamples,
  categories,
  onComponentSelect,
  onComponentDragStart,
  showAddButton = true,
  enableDragAndDrop = true,
}: ComponentGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("layout");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const filteredComponents = componentExamples.filter(
    comp => selectedCategory === "all" || comp.category === selectedCategory
  );

  const handleComponentClick = (component: ComponentExample) => {
    setSelectedComponent(component);
    onOpen();
  };

  const handleAddComponent = (component: ComponentExample) => {
    if (onComponentSelect) {
      onComponentSelect(component);
    }
    onClose();
  };

  const handleDragStart = (component: ComponentExample, event: React.DragEvent) => {
    if (onComponentDragStart) {
      onComponentDragStart(component, event);
    } else {
      // Default drag behavior
      event.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          type: "component",
          component: {
            id: component.id,
            name: component.name,
            props: component.defaultProps || component.props,
            category: component.category,
          },
        })
      );
      event.dataTransfer.effectAllowed = "copy";
    }
  };

  return (
    <Box>
      {/* Header */}
      <VStack spacing={6} align="stretch" mb={8}>
        <HStack justify="space-between">
          <VStack align="start" spacing={2}>
            <Heading size="lg">Component Gallery</Heading>
            <Text color="gray.600">Browse and preview all available content components</Text>
          </VStack>
          <HStack spacing={3}>
            <Tooltip label="Grid View">
              <IconButton
                aria-label="Grid view"
                icon={<FiGrid />}
                variant={viewMode === "grid" ? "solid" : "ghost"}
                onClick={() => setViewMode("grid")}
                size="sm"
              />
            </Tooltip>
            <Tooltip label="List View">
              <IconButton
                aria-label="List view"
                icon={<FiList />}
                variant={viewMode === "list" ? "solid" : "ghost"}
                onClick={() => setViewMode("list")}
                size="sm"
              />
            </Tooltip>
          </HStack>
        </HStack>

        {/* Category Tabs */}
        <Tabs
          index={categories.findIndex(cat => cat.key === selectedCategory) + 1}
          onChange={index => {
            if (index === 0) {
              setSelectedCategory("all");
            } else {
              setSelectedCategory(categories[index - 1].key);
            }
          }}
        >
          <TabList>
            <Tab>All Components</Tab>
            {categories.map(category => (
              <Tab key={category.key}>
                <HStack spacing={2}>
                  <Icon as={category.icon} />
                  <Text>{category.label}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </VStack>

      {/* Component Grid/List */}
      {viewMode === "grid" ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredComponents.map((component, index) => (
            <ComponentCard
              key={`${component.category}-${component.name}-${index}`}
              component={component}
              onClick={() => handleComponentClick(component)}
              onAdd={showAddButton ? () => handleAddComponent(component) : undefined}
              onDragStart={enableDragAndDrop ? e => handleDragStart(component, e) : undefined}
              enableDragAndDrop={enableDragAndDrop}
            />
          ))}
        </SimpleGrid>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredComponents.map((component, index) => (
            <ComponentListItem
              key={`${component.category}-${component.name}-${index}`}
              component={component}
              onClick={() => handleComponentClick(component)}
              onAdd={showAddButton ? () => handleAddComponent(component) : undefined}
              onDragStart={enableDragAndDrop ? e => handleDragStart(component, e) : undefined}
              enableDragAndDrop={enableDragAndDrop}
            />
          ))}
        </VStack>
      )}

      {/* Component Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={selectedComponent?.icon} color="blue.500" />
              <Text>{selectedComponent?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedComponent && (
              <VStack spacing={6} align="stretch">
                {/* Preview */}
                <Box>
                  <Text fontWeight="medium" mb={3}>
                    Preview
                  </Text>
                  <Box border="1px solid" borderColor={borderColor} borderRadius="md" p={4}>
                    {selectedComponent.preview}
                  </Box>
                </Box>

                {/* Description */}
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Description
                  </Text>
                  <Text color="gray.600">{selectedComponent.description}</Text>
                </Box>

                {/* Usage */}
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Usage
                  </Text>
                  <Text color="gray.600">{selectedComponent.usage}</Text>
                </Box>

                {/* Props */}
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Properties
                  </Text>
                  <Box bg="gray.50" p={3} borderRadius="md">
                    <Text fontSize="sm" fontFamily="mono">
                      {JSON.stringify(selectedComponent.props, null, 2)}
                    </Text>
                  </Box>
                </Box>

                {/* Tags */}
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Tags
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {selectedComponent.tags.map((tag, index) => (
                      <Badge
                        key={`${selectedComponent.name}-tag-${tag}-${index}`}
                        colorScheme="blue"
                        variant="subtle"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>

                {/* Actions */}
                {showAddButton && (
                  <HStack justify="end" spacing={3}>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      leftIcon={<FiPlus />}
                      onClick={() => handleAddComponent(selectedComponent)}
                      colorScheme="blue"
                    >
                      Add to Page
                    </Button>
                  </HStack>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

interface ComponentCardProps {
  component: ComponentExample;
  onClick: () => void;
  onAdd?: () => void;
  onDragStart?: (event: React.DragEvent) => void;
  enableDragAndDrop?: boolean;
}

function ComponentCard({
  component,
  onClick,
  onAdd,
  onDragStart,
  enableDragAndDrop,
}: ComponentCardProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Card
      cursor="pointer"
      onClick={onClick}
      draggable={enableDragAndDrop && component.isDraggable}
      onDragStart={onDragStart}
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      transition="all 0.2s"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <CardHeader pb={3}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={component.icon} color="blue.500" boxSize={5} />
            <VStack align="start" spacing={1}>
              <Text fontWeight="semibold" fontSize="lg">
                {component.name}
              </Text>
              <Badge colorScheme="blue" variant="subtle" size="sm">
                {component.category}
              </Badge>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            {enableDragAndDrop && component.isDraggable && (
              <Tooltip label="Drag to add">
                <Icon
                  as={FiMove}
                  color="gray.400"
                  boxSize={4}
                  cursor="grab"
                  _hover={{ color: "gray.600" }}
                />
              </Tooltip>
            )}
            {onAdd && (
              <Tooltip label="Add to page">
                <IconButton
                  aria-label="Add component"
                  icon={<FiPlus />}
                  size="sm"
                  variant="ghost"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                />
              </Tooltip>
            )}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {component.description}
          </Text>

          {/* Preview */}
          <Box border="1px solid" borderColor={borderColor} borderRadius="md" p={3}>
            {component.preview}
          </Box>

          {/* Tags */}
          <HStack spacing={2} flexWrap="wrap">
            {component.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} colorScheme="gray" variant="subtle" size="sm">
                {tag}
              </Badge>
            ))}
            {component.tags.length > 3 && (
              <Badge colorScheme="gray" variant="subtle" size="sm">
                +{component.tags.length - 3}
              </Badge>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

interface ComponentListItemProps {
  component: ComponentExample;
  onClick: () => void;
  onAdd?: () => void;
  onDragStart?: (event: React.DragEvent) => void;
  enableDragAndDrop?: boolean;
}

function ComponentListItem({
  component,
  onClick,
  onAdd,
  onDragStart,
  enableDragAndDrop,
}: ComponentListItemProps) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Card
      cursor="pointer"
      onClick={onClick}
      draggable={enableDragAndDrop && component.isDraggable}
      onDragStart={onDragStart}
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <CardBody>
        <HStack justify="space-between" align="start">
          <HStack spacing={4} align="start" flex={1}>
            <Icon as={component.icon} color="blue.500" boxSize={6} mt={1} />
            <VStack align="start" spacing={2} flex={1}>
              <HStack spacing={3}>
                <Text fontWeight="semibold" fontSize="lg">
                  {component.name}
                </Text>
                <Badge colorScheme="blue" variant="subtle">
                  {component.category}
                </Badge>
              </HStack>
              <Text color="gray.600" fontSize="sm">
                {component.description}
              </Text>
              <HStack spacing={2} flexWrap="wrap">
                {component.tags.map((tag, index) => (
                  <Badge key={index} colorScheme="gray" variant="subtle" size="sm">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          </HStack>

          <HStack spacing={2}>
            {enableDragAndDrop && component.isDraggable && (
              <Tooltip label="Drag to add">
                <Icon
                  as={FiMove}
                  color="gray.400"
                  boxSize={4}
                  cursor="grab"
                  _hover={{ color: "gray.600" }}
                />
              </Tooltip>
            )}
            <Tooltip label="Preview">
              <IconButton
                aria-label="Preview component"
                icon={<FiEye />}
                size="sm"
                variant="ghost"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onClick();
                }}
              />
            </Tooltip>
            {onAdd && (
              <Tooltip label="Add to page">
                <IconButton
                  aria-label="Add component"
                  icon={<FiPlus />}
                  size="sm"
                  variant="ghost"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                />
              </Tooltip>
            )}
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
