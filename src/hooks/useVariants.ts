"use client";

import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_VARIANTS, GET_PRODUCT_VARIANTS, SEARCH_VARIANTS } from "@/graphql/queries/variants";
import { useState, useMemo } from "react";

interface VariantFilters {
  search: string;
  color: string;
  size: string;
  productId?: string;
  lowStock?: boolean;
}

/**
 * Apollo-based variants hook
 * Replaces useVariantStore with GraphQL power
 */
export function useVariants(productId?: string) {
  const [filters, setFilters] = useState<VariantFilters>({
    search: "",
    color: "",
    size: "",
    productId,
  });

  // Choose query based on whether we're viewing product-specific variants
  const query = productId ? GET_PRODUCT_VARIANTS : GET_VARIANTS;
  const variables = productId
    ? { productId, first: 50 }
    : {
        first: 50,
        filter: {
          search: filters.search || undefined,
          color: filters.color || undefined,
          size: filters.size || undefined,
          lowStock: filters.lowStock || undefined,
        },
      };

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(query, {
    variables,
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  // Search variants
  const [searchVariants, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SEARCH_VARIANTS);

  // Extract variants from different query structures
  const variants = useMemo(() => {
    if (productId) {
      // Product-specific variants
      return (
        data?.product?.variants?.edges?.map((edge: unknown) => (edge as { node: unknown }).node) ||
        []
      );
    } else {
      // All variants
      return data?.variants?.edges?.map((edge: unknown) => (edge as { node: unknown }).node) || [];
    }
  }, [data, productId]);

  const pageInfo = productId ? data?.product?.variants?.pageInfo : data?.variants?.pageInfo;

  const totalCount = productId
    ? data?.product?.variants?.totalCount
    : data?.variants?.totalCount || 0;

  // Get unique colors and sizes for filtering
  const { colors, sizes } = useMemo(() => {
    const uniqueColors = [
      ...new Set(variants.map((v: unknown) => (v as { Color: string }).Color)),
    ].sort();
    const uniqueSizes = [
      ...new Set(variants.map((v: unknown) => (v as { Size: string }).Size)),
    ].sort();
    return { colors: uniqueColors, sizes: uniqueSizes };
  }, [variants]);

  // Apollo infinite scroll
  const loadMore = async () => {
    if (pageInfo?.hasNextPage) {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          const prevEdges = productId
            ? prev.product?.variants?.edges || []
            : prev.variants?.edges || [];

          const newEdges = productId
            ? fetchMoreResult.product?.variants?.edges || []
            : fetchMoreResult.variants?.edges || [];

          if (productId) {
            return {
              product: {
                ...prev.product,
                variants: {
                  ...fetchMoreResult.product.variants,
                  edges: [...prevEdges, ...newEdges],
                },
              },
            };
          } else {
            return {
              variants: {
                ...fetchMoreResult.variants,
                edges: [...prevEdges, ...newEdges],
              },
            };
          }
        },
      });
    }
  };

  const updateFilters = (newFilters: Partial<VariantFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    if (!productId) {
      refetch({
        filter: {
          search: updatedFilters.search || undefined,
          color: updatedFilters.color || undefined,
          size: updatedFilters.size || undefined,
          lowStock: updatedFilters.lowStock || undefined,
        },
      });
    }
  };

  const clearFilters = () => {
    setFilters({ search: "", color: "", size: "", productId });
    if (!productId) {
      refetch({ filter: {} });
    }
  };

  const performSearch = (query: string) => {
    if (query.trim()) {
      searchVariants({
        variables: { query, first: 10 },
      });
    }
  };

  // Client-side filtering for product-specific variants
  const filteredVariants = useMemo(() => {
    if (!productId) return variants;

    return variants.filter((variant: unknown) => {
      const v = variant as { SkuId: string; Color: string; Size: string };
      const matchesSearch =
        !filters.search ||
        v.SkuId.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.Color.toLowerCase().includes(filters.search.toLowerCase()) ||
        v.Size.toLowerCase().includes(filters.search.toLowerCase());

      const matchesColor = !filters.color || v.Color === filters.color;
      const matchesSize = !filters.size || v.Size === filters.size;

      return matchesSearch && matchesColor && matchesSize;
    });
  }, [variants, filters, productId]);

  return {
    // Data
    variants: productId ? filteredVariants : variants,
    totalCount,
    searchResults:
      searchData?.variantSearch?.edges?.map((edge: unknown) => (edge as { node: unknown }).node) ||
      [],

    // Filter options
    colors,
    sizes,

    // Loading states
    loading,
    searchLoading,
    loadingMore: networkStatus === 3,

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
