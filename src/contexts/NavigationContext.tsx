"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  // Left sidebar state
  leftSidebarExpanded: boolean;
  leftSidebarPinned: boolean;
  setLeftSidebarExpanded: (expanded: boolean) => void;
  setLeftSidebarPinned: (pinned: boolean) => void;

  // Right panel state
  rightPanelOpen: boolean;
  rightPanelContent: ReactNode | null;
  rightPanelTitle: string;
  openRightPanel: (content: ReactNode, title?: string) => void;
  closeRightPanel: () => void;

  // Mutual exclusion logic
  toggleLeftSidebar: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(true); // Changed from false to true
  const [leftSidebarPinned, setLeftSidebarPinned] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<ReactNode | null>(null);
  const [rightPanelTitle, setRightPanelTitle] = useState("");

  const openRightPanel = (content: ReactNode, title = "Details") => {
    // Auto-collapse left sidebar when opening right panel
    setLeftSidebarExpanded(false);
    setLeftSidebarPinned(false);

    setRightPanelContent(content);
    setRightPanelTitle(title);
    setRightPanelOpen(true);
  };

  const closeRightPanel = () => {
    setRightPanelOpen(false);
    setRightPanelContent(null);
    setRightPanelTitle("");
  };

  const toggleLeftSidebar = () => {
    const newExpanded = !leftSidebarExpanded;
    setLeftSidebarExpanded(newExpanded);

    // Auto-collapse right panel when expanding left sidebar
    if (newExpanded && rightPanelOpen) {
      closeRightPanel();
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        leftSidebarExpanded,
        leftSidebarPinned,
        setLeftSidebarExpanded,
        setLeftSidebarPinned,
        rightPanelOpen,
        rightPanelContent,
        rightPanelTitle,
        openRightPanel,
        closeRightPanel,
        toggleLeftSidebar,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
