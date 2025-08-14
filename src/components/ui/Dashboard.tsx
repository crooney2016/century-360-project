"use client";

import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Grid,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

/**
 * Dashboard Card Props
 */
export interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    type: "increase" | "decrease";
  };
  color?: string;
  icon?: React.ComponentType<{ color?: string; boxSize?: number; className?: string }>;
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * Dashboard Card Component
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color = "blue",
  icon: Icon,
  onClick,
  children,
}) => {
  return (
    <Card.Root
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      _hover={onClick ? { transform: "translateY(-2px)", shadow: "lg" } : {}}
      transition="all 0.2s"
    >
      <CardBody>
        <VStack align="start" gap={3}>
          <HStack justify="space-between" width="100%">
            <VStack align="start" gap={1}>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {title}
              </Text>
              <VStack align="start" gap={1}>
                <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
                  {value}
                </Text>
                {subtitle && (
                  <Text fontSize="xs" color="gray.500">
                    {subtitle}
                  </Text>
                )}
                {trend && (
                  <Text fontSize="xs" color={trend.type === "increase" ? "green.600" : "red.600"}>
                    {trend.type === "increase" ? "↗" : "↘"} {trend.value}%
                  </Text>
                )}
              </VStack>
            </VStack>
            {Icon && <Icon color={`${color}.500`} boxSize={6} />}
          </HStack>
          {children}
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

/**
 * Progress Card Props
 */
export interface ProgressCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  color?: string;
  icon?: React.ComponentType<{ color?: string; className?: string }>;
  showPercentage?: boolean;
}

/**
 * Progress Card Component
 */
export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  maxValue = 100,
  unit = "%",
  color = "blue",
  icon: Icon,
  showPercentage = true,
}) => {
  const percentage = (value / maxValue) * 100;
  const isHigh = percentage > 80;
  const isMedium = percentage > 60;

  return (
    <Card.Root>
      <CardBody>
        <VStack align="start" gap={3}>
          <HStack>
            {Icon && <Icon color={`${color}.500`} />}
            <Text fontWeight="medium">{title}</Text>
          </HStack>
          <VStack align="start" gap={1}>
            <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
              {value.toFixed(1)}
              {unit}
            </Text>
            {showPercentage && (
              <Text fontSize="sm" color="gray.600">
                {percentage.toFixed(1)}% of capacity
              </Text>
            )}
          </VStack>
          <Box width="100%" height="8px" bg="gray.200" borderRadius="full" overflow="hidden">
            <Box
              height="100%"
              bg={isHigh ? "red.500" : isMedium ? "yellow.500" : `${color}.500`}
              width={`${percentage}%`}
              transition="width 0.3s ease"
            />
          </Box>
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

/**
 * Status Card Props
 */
export interface StatusCardProps {
  title: string;
  status: "success" | "warning" | "error" | "info";
  message: string;
  details?: string;
  timestamp?: string;
  icon?: React.ComponentType<{ color?: string; boxSize?: number; className?: string }>;
}

/**
 * Status Card Component
 */
export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  message,
  details,
  timestamp,
  icon: Icon,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "green";
      case "warning":
        return "yellow";
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusIcon = () => {
    if (Icon) return Icon;
    // Default icons based on status
    return null;
  };

  return (
    <Card.Root>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="sm">{title}</Heading>
          {getStatusIcon() &&
            React.createElement(getStatusIcon()!, { color: `${getStatusColor()}.500` })}
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="start" gap={2}>
          <Badge colorPalette={getStatusColor()} variant="subtle">
            {status.toUpperCase()}
          </Badge>
          <Text fontSize="sm">{message}</Text>
          {details && (
            <Text fontSize="xs" color="gray.600">
              {details}
            </Text>
          )}
          {timestamp && (
            <Text fontSize="xs" color="gray.500">
              {timestamp}
            </Text>
          )}
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

/**
 * Dashboard Grid Props
 */
export interface DashboardGridProps {
  children: React.ReactNode;
  columns?: number;
  spacing?: number;
  minChildWidth?: string;
}

/**
 * Dashboard Grid Component
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 4,
  spacing = 4,
  minChildWidth = "250px",
}) => {
  return (
    <Grid templateColumns={`repeat(${columns}, minmax(${minChildWidth}, 1fr))`} gap={spacing}>
      {children}
    </Grid>
  );
};

/**
 * Dashboard Section Props
 */
export interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

/**
 * Dashboard Section Component
 */
export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
  actions,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const { open, onToggle } = useDisclosure({ defaultOpen: defaultExpanded });

  return (
    <Card.Root>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">{title}</Heading>
          <HStack gap={2}>
            {actions}
            {collapsible && (
              <Button size="sm" variant="ghost" onClick={onToggle}>
                {open ? "Collapse" : "Expand"}
              </Button>
            )}
          </HStack>
        </HStack>
      </CardHeader>
      {open && <CardBody>{children}</CardBody>}
    </Card.Root>
  );
};

/**
 * Dashboard Header Props
 */
export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  status?: {
    text: string;
    color: string;
  };
}

/**
 * Dashboard Header Component
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  actions,
  status,
}) => {
  return (
    <HStack justify="space-between" align="center" mb={6}>
      <VStack align="start" gap={1}>
        <Heading size="lg">{title}</Heading>
        {subtitle && <Text color="gray.600">{subtitle}</Text>}
      </VStack>
      <HStack gap={2}>
        {status && (
          <Badge colorPalette={status.color} variant="subtle">
            {status.text}
          </Badge>
        )}
        {actions}
      </HStack>
    </HStack>
  );
};

/**
 * Dashboard Container Props
 */
export interface DashboardContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: number;
}

/**
 * Dashboard Container Component
 */
export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  children,
  maxWidth = "100%",
  padding = 6,
}) => {
  return (
    <Box p={padding} maxWidth={maxWidth} mx="auto">
      <VStack align="stretch" gap={6}>
        {children}
      </VStack>
    </Box>
  );
};

/**
 * Metric Card Props
 */
export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
    period: string;
  };
  color?: string;
}

/**
 * Metric Card Component
 */
export const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, color = "blue" }) => {
  return (
    <Card.Root>
      <CardBody>
        <VStack align="start" gap={2}>
          <Text fontSize="sm" color="gray.600" fontWeight="medium">
            {label}
          </Text>
          <VStack align="start" gap={1}>
            <Text fontSize="3xl" fontWeight="bold" color={`${color}.600`}>
              {value}
            </Text>
            {change && (
              <Text fontSize="sm" color={change.type === "increase" ? "green.600" : "red.600"}>
                {change.type === "increase" ? "↗" : "↘"} {change.value}% {change.period}
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

// All components are exported inline above
