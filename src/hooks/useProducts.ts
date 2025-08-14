"use client";

import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_PRODUCTS, SEARCH_PRODUCTS } from "@/graphql/queries/products";
import { useState, useMemo } from "react";

/**
 * Apollo-based product hook with advanced features
 * Replaces useProductStore for server state management
 */
export function useProducts() {
  const [filters, setFilters] = useState({
    search: "",
    dept: "",
    class: "",
  });

  // Main products query with Apollo's built-in features
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 50,
      filter: {
        search: filters.search || undefined,
        dept: filters.dept || undefined,
        class: filters.class || undefined,
      },
    },
    // Apollo's automatic error handling and caching
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    // Cache for 5 minutes
    fetchPolicy: "cache-and-network",
  });

  // Separate search query for autocomplete
  const [searchProducts, { data: searchData, loading: searchLoading }] = useLazyQuery(
    SEARCH_PRODUCTS,
    {
      fetchPolicy: "cache-first",
    }
  );

  // Extract products and pagination from Apollo's normalized data
  const products = useMemo(() => {
    return data?.products?.edges?.map((edge: unknown) => (edge as { node: unknown }).node) || [];
  }, [data]);

  const pageInfo = data?.products?.pageInfo;
  const totalCount = data?.products?.totalCount || 0;

  // Apollo's built-in infinite scroll
  const loadMore = async () => {
    if (pageInfo?.hasNextPage) {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            products: {
              ...fetchMoreResult.products,
              edges: [...prev.products.edges, ...fetchMoreResult.products.edges],
            },
          };
        },
      });
    }
  };

  // Update filters and refetch
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    refetch({
      filter: {
        search: newFilters.search || filters.search || undefined,
        dept: newFilters.dept || filters.dept || undefined,
        class: newFilters.class || filters.class || undefined,
      },
    });
  };

  const clearFilters = () => {
    setFilters({ search: "", dept: "", class: "" });
    refetch({ filter: {} });
  };

  // Search with debouncing
  const performSearch = (query: string) => {
    if (query.trim()) {
      searchProducts({
        variables: { query, first: 10 },
      });
    }
  };

  return {
    // Data
    products,
    totalCount,
    searchResults:
      searchData?.productSearch?.edges?.map((edge: unknown) => (edge as { node: unknown }).node) ||
      [],

    // Loading states (Apollo provides granular loading states)
    loading,
    searchLoading,
    loadingMore: networkStatus === 3, // Apollo's fetchMore loading

    // Error handling
    error,

    // Pagination
    hasNextPage: pageInfo?.hasNextPage || false,
    loadMore,

    // Filtering
    filters,
    updateFilters,
    clearFilters,

    // Search
    performSearch,

    // Manual operations
    refetch,
  };
}
