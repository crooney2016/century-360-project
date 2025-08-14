"use client";

import { IconButton, Tooltip, Icon } from "@chakra-ui/react";
// TODO: May need Box for future layout enhancements
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigation } from "@/contexts/NavigationContext";

export function MenuIcon() {
  const { leftSidebarExpanded, toggleLeftSidebar } = useNavigation();

  return (
    <Tooltip label={leftSidebarExpanded ? "Collapse Menu" : "Expand Menu"}>
      <IconButton
        aria-label={leftSidebarExpanded ? "Collapse menu" : "Expand menu"}
        variant="ghost"
        size="sm"
        onClick={toggleLeftSidebar}
        color={{ base: "gray.600", _dark: "gray.300" }}
        _hover={{
          bg: { base: "gray.100", _dark: "gray.700" },
          color: { base: "gray.900", _dark: "gray.100" },
        }}
      >
        <Icon
          as={leftSidebarExpanded ? FiX : FiMenu}
          transform={leftSidebarExpanded ? "rotate(180deg)" : "rotate(0deg)"}
          transition="transform 0.2s"
        />
      </IconButton>
    </Tooltip>
  );
}
