"use client";

import { ApolloClient, InMemoryCache, from, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { relayStylePagination } from "@apollo/client/utilities";

// HTTP link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: "/api/graphql",
});

// Auth link for future authentication
const authLink = setContext((_, { headers }) => {
  // Get auth token from localStorage, cookies, or context
  // const token = localStorage.getItem('auth-token');

  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link for centralized error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

// Optimized cache configuration for Product 360
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Enable cursor-based pagination for products
        products: relayStylePagination(),
        // Enable cursor-based pagination for variants
        variants: relayStylePagination(),
        // Cache product search results by search terms
        productSearch: {
          keyArgs: ["filter", "sort"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Product: {
      fields: {
        // Cache variants as a relational field
        variants: relayStylePagination(),
      },
    },
    // Normalize cache keys for optimal performance
    ProductConnection: {
      keyFields: false,
    },
    VariantConnection: {
      keyFields: false,
    },
  },
});

// Create Apollo Client with advanced features
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: "all",
    },
  },
  // Enable development tools
  connectToDevTools: process.env.NODE_ENV === "development",
});

// Export useful hooks and utilities
export * from "@apollo/client";
