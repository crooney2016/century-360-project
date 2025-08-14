"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Link } from "@chakra-ui/react";
import * as React from "react";

/**
 * App-aware navigation link with active styling using Chakra UI.
 *
 * @example
 * ```tsx
 * <NavLink href="/catalog">Catalog</NavLink>
 * ```
 */
export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      as={NextLink}
      href={href}
      aria-current={isActive ? "page" : undefined}
      color={isActive ? "blue.600" : "gray.600"}
      fontWeight={isActive ? "semibold" : "medium"}
      _hover={{
        color: "blue.700",
        textDecoration: "underline",
      }}
    >
      {children}
    </Link>
  );
}

export default NavLink;
