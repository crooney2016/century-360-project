import { gql } from "@apollo/client";

// Core variant fragment
export const VARIANT_CORE_FRAGMENT = gql`
  fragment VariantCore on Variant {
    id
    ItemNumber
    SkuId
    Color
    Size
    RetailPrice
    WholesalePrice
    OnHandQty
    CreatedAt
    UpdatedAt
  }
`;

// Extended variant fragment with product relation
export const VARIANT_DETAIL_FRAGMENT = gql`
  fragment VariantDetail on Variant {
    ...VariantCore
    product {
      id
      Name
      Dept
      Class
    }
    # Future inventory tracking
    # inventory {
    #   location
    #   available
    #   reserved
    #   incoming
    # }
  }
  ${VARIANT_CORE_FRAGMENT}
`;

// Variants query with filtering and infinite scroll
export const GET_VARIANTS = gql`
  query GetVariants($first: Int, $after: String, $filter: VariantFilter, $sort: VariantSort) {
    variants(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        node {
          ...VariantCore
          product {
            Name
            Dept
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${VARIANT_CORE_FRAGMENT}
`;

// Single variant detail
export const GET_VARIANT = gql`
  query GetVariant($id: ID!) {
    variant(id: $id) {
      ...VariantDetail
    }
  }
  ${VARIANT_DETAIL_FRAGMENT}
`;

// Variants by product for Product 360
export const GET_PRODUCT_VARIANTS = gql`
  query GetProductVariants($productId: ID!, $first: Int = 20, $after: String) {
    product(id: $productId) {
      id
      Name
      variants(first: $first, after: $after) {
        edges {
          node {
            ...VariantCore
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${VARIANT_CORE_FRAGMENT}
`;

// Low stock variants for dashboard alerts
export const GET_LOW_STOCK_VARIANTS = gql`
  query GetLowStockVariants($threshold: Int = 10, $first: Int = 50) {
    variants(
      filter: { maxStock: $threshold }
      sort: { field: ON_HAND_QTY, order: ASC }
      first: $first
    ) {
      edges {
        node {
          ...VariantCore
          product {
            Name
            Dept
          }
        }
      }
    }
  }
  ${VARIANT_CORE_FRAGMENT}
`;

// Variant search by SKU or color/size
export const SEARCH_VARIANTS = gql`
  query SearchVariants($query: String!, $first: Int = 10) {
    variantSearch(query: $query, first: $first) {
      edges {
        node {
          ...VariantCore
          product {
            Name
          }
        }
      }
    }
  }
  ${VARIANT_CORE_FRAGMENT}
`;
