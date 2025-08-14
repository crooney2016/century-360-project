"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Divider,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiCheckSquare,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiFileText,
  FiGrid,
  FiLayers,
  FiEdit3,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isActive?: boolean;
}

function NavItem({ icon: IconComponent, label, href, isActive }: NavItemProps) {
  const router = useRouter();

  return (
    <Box
      as="button"
      w="full"
      py={3}
      px={4}
      borderRadius="lg"
      bg={isActive ? "glass.primary" : "transparent"}
      border="1px solid"
      borderColor={isActive ? "glass.border" : "transparent"}
      color={isActive ? "glass.dark" : "gray.600"}
      _hover={{
        bg: isActive ? "glass.secondary" : "glass.primary",
        borderColor: "glass.border",
        transform: "translateX(4px)",
      }}
      _dark={{
        color: isActive ? "white" : "gray.300",
        bg: isActive ? "glass.dark" : "transparent",
        _hover: {
          bg: isActive ? "rgba(17, 24, 39, 0.9)" : "rgba(17, 24, 39, 0.7)",
        },
      }}
      transition="all 0.2s ease"
      onClick={() => router.push(href)}
      display="flex"
      alignItems="center"
      gap={3}
      textAlign="left"
      fontWeight={isActive ? "semibold" : "medium"}
    >
      <Icon as={IconComponent} boxSize={5} />
      <Text fontSize="sm">{label}</Text>
    </Box>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const { colorMode } = useColorMode();

  const mainNavItems = [
    { icon: FiHome, label: "Dashboard", href: "/" },
    { icon: FiPackage, label: "Catalog", href: "/catalog" },
    { icon: FiTruck, label: "Variants", href: "/variants" },
    { icon: FiCheckSquare, label: "Orders", href: "/orders" },
    { icon: FiBarChart2, label: "Reports", href: "/reports" },
  ];

  const moduleNavItems = [
    { icon: FiGrid, label: "Content 360", href: "/content-360" },
    { icon: FiLayers, label: "Page Builder", href: "/page-builder" },
    { icon: FiEdit3, label: "Editor", href: "/editor" },
    { icon: FiFileText, label: "Documents", href: "/documents" },
  ];

  const adminNavItems = [
    { icon: FiUsers, label: "Admin", href: "/admin" },
    { icon: FiSettings, label: "Settings", href: "/settings" },
  ];

  return (
    <Box
      w="280px"
      h="100vh"
      bg="glass.backdrop"
      borderRight="1px solid"
      borderColor="glass.border"
      backdropFilter="blur(20px)"
      position="fixed"
      left={0}
      top={0}
      zIndex={10}
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "glass.border",
          borderRadius: "2px",
        },
      }}
    >
      {/* Header */}
      <Box p={6} borderBottom="1px solid" borderColor="glass.border">
        <HStack spacing={3}>
          <Box
            w={8}
            h={8}
            bg="blue.500"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="white" fontWeight="bold" fontSize="sm">
              C
            </Text>
          </Box>
          <Text fontSize="lg" fontWeight="bold" color="glass.dark">
            Century 360°
          </Text>
        </HStack>
      </Box>

      {/* Navigation */}
      <Box p={4}>
        <VStack spacing={2} align="stretch">
          {/* Main Navigation */}
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} mb={2}>
            MAIN NAVIGATION
          </Text>
          {mainNavItems.map(item => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}

          <Divider borderColor="glass.border" my={4} />

          {/* Content 360 Module */}
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} mb={2}>
            CONTENT 360 MODULE
          </Text>
          {moduleNavItems.map(item => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}

          <Divider borderColor="glass.border" my={4} />

          {/* Admin */}
          <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} mb={2}>
            ADMINISTRATION
          </Text>
          {adminNavItems.map(item => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </VStack>
      </Box>

      {/* User Profile */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={4}
        borderTop="1px solid"
        borderColor="glass.border"
        bg="glass.backdrop"
        backdropFilter="blur(20px)"
      >
        <Menu>
          <MenuButton
            as={Box}
            w="full"
            display="flex"
            alignItems="center"
            gap={3}
            p={3}
            borderRadius="lg"
            _hover={{
              bg: "glass.primary",
              borderColor: "glass.border",
            }}
            cursor="pointer"
            transition="all 0.2s ease"
          >
            <Avatar size="sm" bg="blue.500">
              <Text color="white" fontWeight="bold">
                JD
              </Text>
            </Avatar>
            <Box flex={1} textAlign="left">
              <Text fontSize="sm" fontWeight="semibold" color="glass.dark">
                John Doe
              </Text>
              <Text fontSize="xs" color="gray.500">
                Administrator
              </Text>
            </Box>
          </MenuButton>
          <MenuList
            bg="glass.backdrop"
            border="1px solid"
            borderColor="glass.border"
            backdropFilter="blur(20px)"
            minW="200px"
          >
            <MenuItem icon={<Icon as={FiUser} />}>Profile</MenuItem>
            <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
            <MenuDivider />
            <MenuItem icon={<Icon as={FiLogOut} />} color="red.500">
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
}
