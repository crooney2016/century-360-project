import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Product {
  id: string;
  ItemNumber: string;
  Name: string;
  Dept: string;
  Class: string;
  RetailPriceMin: string;
  RetailPriceMax: string;
  WholesalePriceMin: string;
  WholesalePriceMax: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  filters: {
    dept: string;
    class: string;
    search: string;
  };

  // Actions
  setProducts: (products: Product[]) => void;
  addProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasNextPage: (hasNextPage: boolean) => void;
  setCurrentPage: (page: number) => void;
  updateFilters: (filters: Partial<ProductState["filters"]>) => void;
  clearFilters: () => void;
  fetchProducts: (reset?: boolean) => Promise<void>;
  fetchMoreProducts: () => Promise<void>;
}

// GraphQL query for products
const PRODUCTS_QUERY = `
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      totalCount
      pageInfo {
        hasNextPage
        page
        totalPages
      }
      edges {
        node {
          id
          itemNumber
          name
          dept
          class
          retailPriceMin
          retailPriceMax
          wholesalePriceMin
          wholesalePriceMax
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasNextPage: true,
      currentPage: 1,
      filters: {
        dept: "",
        class: "",
        search: "",
      },

      setProducts: products => set({ products }),
      addProducts: products =>
        set(state => ({
          products: [...state.products, ...products],
        })),
      setLoading: loading => set({ loading }),
      setLoadingMore: loadingMore => set({ loadingMore }),
      setError: error => set({ error }),
      setHasNextPage: hasNextPage => set({ hasNextPage }),
      setCurrentPage: currentPage => set({ currentPage }),

      updateFilters: newFilters => {
        set(state => ({
          filters: { ...state.filters, ...newFilters },
        }));
        // Reset pagination when filters change
        set({ products: [], currentPage: 1, hasNextPage: true });
        get().fetchProducts(true);
      },

      clearFilters: () => {
        set({
          filters: { dept: "", class: "", search: "" },
          products: [],
          currentPage: 1,
          hasNextPage: true,
        });
        get().fetchProducts(true);
      },

      fetchProducts: async (reset = false) => {
        const { currentPage, filters } = get();
        const page = reset ? 1 : currentPage;

        set({
          loading: reset,
          loadingMore: !reset,
          error: null,
        });

        try {
          const response = await fetch("/api/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: PRODUCTS_QUERY,
              variables: {
                filter: {
                  search: filters.search || undefined,
                  dept: filters.dept || undefined,
                  class: filters.class || undefined,
                  page,
                  take: 50,
                },
              },
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }

          const result = await response.json();

          if (result.errors) {
            throw new Error(result.errors[0].message);
          }

          const data = result.data.products;
          const products = data.edges.map((edge: any) => ({
            id: edge.node.id,
            ItemNumber: edge.node.itemNumber,
            Name: edge.node.name,
            Dept: edge.node.dept,
            Class: edge.node.class,
            RetailPriceMin: edge.node.retailPriceMin,
            RetailPriceMax: edge.node.retailPriceMax,
            WholesalePriceMin: edge.node.wholesalePriceMin,
            WholesalePriceMax: edge.node.wholesalePriceMax,
            CreatedAt: edge.node.createdAt,
            UpdatedAt: edge.node.updatedAt,
          }));

          if (reset) {
            set({
              products,
              loading: false,
              loadingMore: false,
              hasNextPage: data.pageInfo.hasNextPage,
              currentPage: page,
            });
          } else {
            set({
              loadingMore: false,
              hasNextPage: data.pageInfo.hasNextPage,
              currentPage: page,
            });
            get().addProducts(products);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            loading: false,
            loadingMore: false,
          });
        }
      },

      fetchMoreProducts: async () => {
        const { hasNextPage, loadingMore, currentPage } = get();
        if (!hasNextPage || loadingMore) return;

        set({ currentPage: currentPage + 1 });
        await get().fetchProducts(false);
      },
    }),
    { name: "product-store" }
  )
);
