"use client";

import * as React from "react";
import { Icon as ChakraIcon, type IconProps as ChakraIconProps } from "@chakra-ui/react";
import * as Chakra from "@chakra-ui/icons";
import * as Lucide from "lucide-react";

/**
 * Chakra-first icon registry with graceful fallbacks to Lucide.
 *
 * - Default to @chakra-ui/icons for common pictograms.
 * - Use Lucide for gaps (e.g. bold/italic, data, package).
 * - Supports dynamic runtime registration for Puck/module editor use cases.
 */
const defaultIconRegistry: Record<string, React.ElementType> = {
  // Common actions (Chakra first)
  plus: Chakra.AddIcon,
  minus: Chakra.MinusIcon,
  search: Chakra.SearchIcon,
  settings: Chakra.SettingsIcon,
  download: Chakra.DownloadIcon,
  pencil: Chakra.EditIcon,
  trash: Chakra.DeleteIcon,
  info: Chakra.InfoIcon,
  "check-circle": Chakra.CheckCircleIcon,
  "chevron-down": Chakra.ChevronDownIcon,
  "chevron-left": Chakra.ChevronLeftIcon,
  "chevron-right": Chakra.ChevronRightIcon,
  "chevron-up": Chakra.ChevronUpIcon,
  // Semantic/warnings
  "alert-triangle": Chakra.WarningTwoIcon,
  // Fallbacks served from Lucide where Chakra has no direct equivalent
  database: Lucide.Database,
  package: Lucide.Package,
  boxes: Lucide.Boxes,
  "x-circle": Lucide.XCircle,
  "loader-2": Lucide.Loader2,
  upload: Lucide.Upload,
  filter: Lucide.Filter,
  "sort-asc": Lucide.ArrowUpNarrowWide,
  "sort-desc": Lucide.ArrowDownWideNarrow,
  bold: Lucide.Bold,
  italic: Lucide.Italic,
  list: Lucide.List,
};

const userIconRegistry = new Map<string, React.ElementType>();

export function registerIcons(icons: Record<string, React.ElementType>) {
  Object.entries(icons).forEach(([name, component]) => {
    if (typeof name === "string" && component) {
      userIconRegistry.set(name, component);
    }
  });
}

export function getIconComponent(name: string): React.ElementType | null {
  if (userIconRegistry.has(name)) return userIconRegistry.get(name)!;
  if (name in defaultIconRegistry) return defaultIconRegistry[name];
  return null;
}

export function getAvailableIconNames(): string[] {
  return Array.from(new Set([...Object.keys(defaultIconRegistry), ...userIconRegistry.keys()]));
}

export type IconName = keyof typeof defaultIconRegistry | (string & {});

export function Icon({ name, ...props }: { name: IconName } & Omit<ChakraIconProps, "as">) {
  const Component = getIconComponent(String(name));
  if (!Component) return null;
  return <ChakraIcon as={Component} {...props} />;
}

export default Icon;
