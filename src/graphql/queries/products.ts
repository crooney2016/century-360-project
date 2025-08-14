import { gql } from "@apollo/client";

// Core product fragment for reusability
export const PRODUCT_CORE_FRAGMENT = gql`
  fragment ProductCore on Product {
    id
    ItemNumber
    Name
    Dept
    Class
    RetailPriceMin
    RetailPriceMax
    WholesalePriceMin
    WholesalePriceMax
    CreatedAt
    UpdatedAt
  }
`;

// Extended product fragment for detail views
export const PRODUCT_DETAIL_FRAGMENT = gql`
  fragment ProductDetail on Product {
    ...ProductCore
    variants(first: 10) {
      edges {
        node {
          id
          SkuId
          Color
          Size
          RetailPrice
          WholesalePrice
          OnHandQty
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    # Add more relational data as needed:
    # inventory { ... }
    # metrics { ... }
    # content { ... }
  }
  ${PRODUCT_CORE_FRAGMENT}
`;

// Products query with advanced filtering and pagination
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int, $after: String, $filter: ProductFilter, $sort: ProductSort) {
    products(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        node {
          ...ProductCore
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
  ${PRODUCT_CORE_FRAGMENT}
`;

// Single product query for Product 360 view
export const GET_PRODUCT_360 = gql`
  query GetProduct360($id: ID!, $variantsFirst: Int = 20) {
    product(id: $id) {
      ...ProductDetail
      # Product 360 specific data
      analytics {
        totalSales
        profitMargin
        inventoryTurnover
        lastSaleDate
      }
      relatedProducts(first: 5) {
        edges {
          node {
            ...ProductCore
          }
        }
      }
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`;

// Product search with autocomplete
export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $first: Int = 10, $includeVariants: Boolean = false) {
    productSearch(query: $query, first: $first) {
      edges {
        node {
          ...ProductCore
          variants(first: 3) @include(if: $includeVariants) {
            edges {
              node {
                id
                SkuId
                Color
                Size
              }
            }
          }
        }
      }
    }
  }
  ${PRODUCT_CORE_FRAGMENT}
`;

// Products by department for settings panels
export const GET_PRODUCTS_BY_DEPT = gql`
  query GetProductsByDepartment($dept: String!, $first: Int = 50, $after: String) {
    products(
      filter: { dept: $dept }
      first: $first
      after: $after
      sort: { field: NAME, order: ASC }
    ) {
      edges {
        node {
          ...ProductCore
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_CORE_FRAGMENT}
`;
