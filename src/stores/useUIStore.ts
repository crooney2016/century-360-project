"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * UI-only state management with Zustand
 * This complements Apollo Client for server state
 */

interface UIState {
  // Theme and appearance
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  compactMode: boolean;

  // Table preferences (persist across sessions)
  tablePreferences: {
    productsPageSize: number;
    variantsPageSize: number;
    defaultSort: "name" | "date" | "dept";
    showThumbnails: boolean;
  };

  // Filter panel states
  filterPanels: {
    productsExpanded: boolean;
    variantsExpanded: boolean;
    inventoryExpanded: boolean;
  };

  // Recently viewed (for quick access)
  recentlyViewed: {
    products: string[]; // Product IDs
    variants: string[]; // Variant IDs
  };

  // Search history (for autocomplete)
  searchHistory: string[];

  // Modal and drawer states
  modals: {
    productDetail: { open: boolean; productId?: string };
    variantDetail: { open: boolean; variantId?: string };
    settings: boolean;
    export: boolean;
  };

  // Product 360 view preferences
  product360: {
    activeTab: "overview" | "variants" | "inventory" | "analytics" | "content";
    chartType: "line" | "bar" | "pie";
    timeRange: "7d" | "30d" | "90d" | "1y";
  };
}

interface UIActions {
  // Theme actions
  setTheme: (theme: UIState["theme"]) => void;
  toggleSidebar: () => void;
  setCompactMode: (compact: boolean) => void;

  // Table preferences
  updateTablePreferences: (preferences: Partial<UIState["tablePreferences"]>) => void;

  // Filter panels
  toggleFilterPanel: (panel: keyof UIState["filterPanels"]) => void;

  // Recently viewed
  addRecentProduct: (productId: string) => void;
  addRecentVariant: (variantId: string) => void;
  clearRecentlyViewed: () => void;

  // Search history
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;

  // Modals
  openModal: (modal: keyof UIState["modals"], data?: unknown) => void;
  closeModal: (modal: keyof UIState["modals"]) => void;
  closeAllModals: () => void;

  // Product 360
  setProduct360Tab: (tab: UIState["product360"]["activeTab"]) => void;
  setChartType: (type: UIState["product360"]["chartType"]) => void;
  setTimeRange: (range: UIState["product360"]["timeRange"]) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      set => ({
        // Initial state
        theme: "system",
        sidebarCollapsed: false,
        compactMode: false,

        tablePreferences: {
          productsPageSize: 50,
          variantsPageSize: 50,
          defaultSort: "name",
          showThumbnails: true,
        },

        filterPanels: {
          productsExpanded: true,
          variantsExpanded: true,
          inventoryExpanded: false,
        },

        recentlyViewed: {
          products: [],
          variants: [],
        },

        searchHistory: [],

        modals: {
          productDetail: { open: false },
          variantDetail: { open: false },
          settings: false,
          export: false,
        },

        product360: {
          activeTab: "overview",
          chartType: "line",
          timeRange: "30d",
        },

        // Actions
        setTheme: theme => set({ theme }),

        toggleSidebar: () =>
          set(state => ({
            sidebarCollapsed: !state.sidebarCollapsed,
          })),

        setCompactMode: compact => set({ compactMode: compact }),

        updateTablePreferences: preferences =>
          set(state => ({
            tablePreferences: { ...state.tablePreferences, ...preferences },
          })),

        toggleFilterPanel: panel =>
          set(state => ({
            filterPanels: {
              ...state.filterPanels,
              [panel]: !state.filterPanels[panel],
            },
          })),

        addRecentProduct: productId =>
          set(state => {
            const products = [
              productId,
              ...state.recentlyViewed.products.filter(id => id !== productId),
            ].slice(0, 10);
            // TODO: Use get() for cross-action state access when implementing advanced features
            return {
              recentlyViewed: { ...state.recentlyViewed, products },
            };
          }),

        addRecentVariant: variantId =>
          set(state => {
            const variants = [
              variantId,
              ...state.recentlyViewed.variants.filter(id => id !== variantId),
            ].slice(0, 10);
            return {
              recentlyViewed: { ...state.recentlyViewed, variants },
            };
          }),

        clearRecentlyViewed: () =>
          set({
            recentlyViewed: { products: [], variants: [] },
          }),

        addSearchTerm: term =>
          set(state => {
            if (!term.trim()) return state;
            const history = [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 20);
            return { searchHistory: history };
          }),

        clearSearchHistory: () => set({ searchHistory: [] }),

        openModal: (modal, data) =>
          set(state => ({
            modals: {
              ...state.modals,
              [modal]: typeof data === "object" ? { open: true, ...data } : true,
            },
          })),

        closeModal: modal =>
          set(state => ({
            modals: {
              ...state.modals,
              [modal]:
                modal === "productDetail" || modal === "variantDetail" ? { open: false } : false,
            },
          })),

        closeAllModals: () =>
          set({
            modals: {
              productDetail: { open: false },
              variantDetail: { open: false },
              settings: false,
              export: false,
            },
          }),

        setProduct360Tab: tab =>
          set(state => ({
            product360: { ...state.product360, activeTab: tab },
          })),

        setChartType: type =>
          set(state => ({
            product360: { ...state.product360, chartType: type },
          })),

        setTimeRange: range =>
          set(state => ({
            product360: { ...state.product360, timeRange: range },
          })),
      }),
      {
        name: "century-360-ui-store", // persist key
        // Only persist certain UI preferences
        partialize: state => ({
          theme: state.theme,
          tablePreferences: state.tablePreferences,
          recentlyViewed: state.recentlyViewed,
          searchHistory: state.searchHistory,
          product360: state.product360,
        }),
      }
    ),
    { name: "UIStore" }
  )
);
