"use client";

import { Box } from "@chakra-ui/react";
import { TopNavbar } from "./TopNavbar";
import { SidebarNav } from "./SidebarNav";
import { RightPanel } from "./RightPanel";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { useNavigation } from "@/contexts/NavigationContext";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useFullscreen();
  const {
    leftSidebarExpanded,
    leftSidebarPinned,
    rightPanelOpen,
    // toggleLeftSidebar, // TODO: Add toggle functionality for mobile
    setLeftSidebarPinned,
    setLeftSidebarExpanded,
  } = useNavigation();

  if (isFullscreen) {
    return (
      <Box
        minH="100vh"
        bg={{ base: "blue.50", _dark: "gray.900" }}
        position="relative"
        zIndex="max"
      >
        {children}
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={{ base: "blue.50", _dark: "gray.900" }}>
      {/* Top Navigation */}
      <Box
        position="sticky"
        top="0"
        zIndex="sticky"
        boxShadow="sm"
        bg={{ base: "white/80", _dark: "gray.900/80" }}
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor={{ base: "gray.200", _dark: "gray.700" }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <TopNavbar />
      </Box>

      {/* Content Area with Sidebar */}
      <Box display="flex" position="relative">
        {/* Sidebar */}
        <Box
          position="fixed"
          left="0"
          top="65px"
          height="calc(100vh - 65px)"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          zIndex="docked"
          transform={leftSidebarExpanded ? "translateX(0)" : "translateX(-200px)"} // Fixed transform logic
        >
          <SidebarNav />
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          minW="0"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          ml={leftSidebarExpanded ? "280px" : "80px"}
          position="relative"
        >
          <Box
            bg={{ base: "white/90", _dark: "gray.900/90" }}
            minH="calc(100vh - 65px)"
            m="1" // Reduced from 4 to ~0.25 inches (approximately 18px)
            borderRadius="xl"
            // Enhanced glass-like shadow effect
            boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
            backdropFilter="blur(8px)"
            border="1px solid rgba(255, 255, 255, 0.18)"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
            _dark={{
              bg: "gray.900/90",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              _before: {
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              },
            }}
          >
            <Box position="relative" zIndex={2}>
              {children}
            </Box>
          </Box>
        </Box>

        {/* Right Panel */}
        {rightPanelOpen && <RightPanel />}
      </Box>
    </Box>
  );
}
