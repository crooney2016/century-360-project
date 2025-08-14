"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Variant {
  id: string;
  ItemNumber: string;
  SkuId: string;
  Color: string;
  Size: string;
  RetailPrice: number;
  WholesalePrice: number;
  OnHandQty: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface VariantStore {
  variants: Variant[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  filters: {
    search: string;
    color: string;
    size: string;
  };

  // Actions
  setVariants: (variants: Variant[]) => void;
  addVariants: (variants: Variant[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  setCurrentPage: (page: number) => void;
  setFilters: (filters: Partial<VariantStore["filters"]>) => void;
  fetchVariants: (reset?: boolean) => Promise<void>;
  fetchMoreVariants: () => Promise<void>;
  resetFilters: () => void;
}

export const useVariantStore = create<VariantStore>()(
  devtools(
    (set, get) => ({
      variants: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasNextPage: true,
      currentPage: 1,
      filters: {
        search: "",
        color: "",
        size: "",
      },

      setVariants: variants => set({ variants }),
      addVariants: variants =>
        set(state => ({
          variants: [...state.variants, ...variants],
        })),
      setLoading: loading => set({ loading }),
      setLoadingMore: loadingMore => set({ loadingMore }),
      setError: error => set({ error }),
      setHasNextPage: hasNextPage => set({ hasNextPage }),
      setCurrentPage: currentPage => set({ currentPage }),
      setFilters: newFilters => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
        }));
        // Reset pagination when filters change
        set({ variants: [], currentPage: 1, hasNextPage: true });
        get().fetchVariants(true);
      },

      fetchVariants: async (reset = false) => {
        const { currentPage, filters } = get();
        const page = reset ? 1 : currentPage;

        set({
          loading: reset,
          loadingMore: !reset,
          error: null,
        });

        try {
          const params = new URLSearchParams({
            page: page.toString(),
            take: "50",
            ...(filters.search && { search: filters.search }),
            ...(filters.color && { color: filters.color }),
            ...(filters.size && { size: filters.size }),
          });

          const response = await fetch(`/api/admin/variants?${params}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch variants: ${response.statusText}`);
          }
          const data = await response.json();

          if (reset) {
            set({
              variants: data.variants || [],
              loading: false,
              loadingMore: false,
              hasNextPage: data.hasNextPage || false,
              currentPage: page,
            });
          } else {
            set({
              loadingMore: false,
              hasNextPage: data.hasNextPage || false,
              currentPage: page,
            });
            get().addVariants(data.variants || []);
          }
        } catch (error) {
          console.error("Error fetching variants:", error);
          set({
            error: error instanceof Error ? error.message : "Failed to fetch variants",
            loading: false,
            loadingMore: false,
          });
        }
      },

      fetchMoreVariants: async () => {
        const { hasNextPage, loadingMore, currentPage } = get();
        if (!hasNextPage || loadingMore) return;

        set({ currentPage: currentPage + 1 });
        await get().fetchVariants(false);
      },

      resetFilters: () => {
        set({
          filters: {
            search: "",
            color: "",
            size: "",
          },
          variants: [],
          currentPage: 1,
          hasNextPage: true,
        });
        get().fetchVariants(true);
      },
    }),
    {
      name: "variant-store",
    }
  )
);
