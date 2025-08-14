"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { ReactNode } from "react";

interface ApolloProviderProps {
  children: ReactNode;
}

/**
 * Apollo Client Provider for GraphQL operations
 *
 * Provides advanced features:
 * - Normalized caching for Product 360 data
 * - Infinite scroll pagination
 * - Real-time subscriptions capability
 * - Optimistic updates
 * - Error boundaries
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
  return <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>;
}
