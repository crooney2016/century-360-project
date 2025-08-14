import { gql } from "graphql-tag";

export const typeDefs = gql`
  # Product types matching Prisma schema
  type Product {
    id: ID!
    itemNumber: String!
    name: String!
    dept: String!
    class: String!
    retailPriceMin: String!
    retailPriceMax: String!
    wholesalePriceMin: String!
    wholesalePriceMax: String!
    createdAt: String!
    updatedAt: String!
    variants: [Variant!]!
  }

  type Variant {
    id: ID!
    itemNumber: String!
    skuId: String!
    color: String!
    size: String!
    retailPrice: Float!
    wholesalePrice: Float!
    onHandQty: Int!
    createdAt: String!
    updatedAt: String!
    product: Product!
  }

  type ColorDimension {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type SizeDimension {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  # Pagination types
  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    page: Int!
    totalPages: Int!
    totalCount: Int!
  }

  # Input types
  input ProductFilterInput {
    search: String
    dept: String
    class: String
    page: Int = 1
    take: Int = 50
  }

  input CreateProductInput {
    itemNumber: String!
    name: String!
    dept: String!
    class: String!
    retailPriceMin: String!
    retailPriceMax: String!
    wholesalePriceMin: String!
    wholesalePriceMax: String!
  }

  input UpdateProductInput {
    id: ID!
    itemNumber: String
    name: String
    dept: String
    class: String
    retailPriceMin: String
    retailPriceMax: String
    wholesalePriceMin: String
    wholesalePriceMax: String
  }

  # Page Management types
  type PageTemplate {
    id: ID!
    name: String!
    description: String
    data: JSON!
    tags: [String!]
    category: String
    isPublic: Boolean!
    author: String
    version: String!
    createdAt: String!
    updatedAt: String!
    metadata: PageMetadata
  }

  type PageMetadata {
    thumbnail: String
    previewUrl: String
    componentCount: Int!
    estimatedSize: Int!
    lastPublished: String
    publishCount: Int!
  }

  type PageOperation {
    id: ID!
    operationType: PageOperationType!
    status: OperationStatus!
    progress: Int!
    result: JSON
    error: String
    createdAt: String!
    completedAt: String
  }

  enum PageOperationType {
    CREATE
    UPDATE
    DELETE
    PUBLISH
    DUPLICATE
    EXPORT
    IMPORT
    VALIDATE
  }

  enum OperationStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    FAILED
    CANCELLED
  }

  type PageTemplateConnection {
    edges: [PageTemplateEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PageTemplateEdge {
    node: PageTemplate!
    cursor: String!
  }

  # Input types
  input CreatePageTemplateInput {
    name: String!
    description: String
    data: JSON!
    tags: [String!]
    category: String
    isPublic: Boolean = false
    author: String
    version: String = "1.0.0"
    metadata: PageMetadataInput
  }

  input UpdatePageTemplateInput {
    id: ID!
    name: String
    description: String
    data: JSON
    tags: [String!]
    category: String
    isPublic: Boolean
    version: String
    metadata: PageMetadataInput
  }

  input PageMetadataInput {
    thumbnail: String
    previewUrl: String
    componentCount: Int
    estimatedSize: Int
    lastPublished: String
    publishCount: Int
  }

  input PageTemplateFilterInput {
    search: String
    category: String
    tags: [String!]
    isPublic: Boolean
    author: String
    page: Int = 1
    take: Int = 20
  }

  input CreatePageOperationInput {
    operationType: PageOperationType!
    templateId: ID
    data: JSON
  }

  # Queries
  type Query {
    # Product queries
    products(filter: ProductFilterInput): ProductConnection!
    product(id: ID!): Product
    productByItemNumber(itemNumber: String!): Product
    productCount(filter: ProductFilterInput): Int!

    # Variant queries
    variants(itemNumber: String!): [Variant!]!
    variant(id: ID!): Variant

    # Dimension queries
    colorDimensions: [ColorDimension!]!
    sizeDimensions: [SizeDimension!]!

    # Page template queries
    pageTemplates(filter: PageTemplateFilterInput): PageTemplateConnection!
    pageTemplate(id: ID!): PageTemplate
    pageTemplateBySlug(slug: String!): PageTemplate

    # Page operation queries
    pageOperations(templateId: ID): [PageOperation!]!
    pageOperation(id: ID!): PageOperation

    # Health check
    health: String!
  }

  # Mutations
  type Mutation {
    # Product mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Page template mutations
    createPageTemplate(input: CreatePageTemplateInput!): PageTemplate!
    updatePageTemplate(input: UpdatePageTemplateInput!): PageTemplate!
    deletePageTemplate(id: ID!): Boolean!
    duplicatePageTemplate(id: ID!): PageTemplate!
    publishPageTemplate(id: ID!): PageTemplate!

    # Page operation mutations
    createPageOperation(input: CreatePageOperationInput!): PageOperation!
    updatePageOperation(
      id: ID!
      status: OperationStatus!
      progress: Int
      result: JSON
      error: String
    ): PageOperation!

    # Health check
    ping: String!
  }

  # Scalar types
  scalar JSON
  scalar DateTime
`;
