import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { ProductMapper, VariantMapper } from '../mappers';
import { GraphQLContext } from '../server';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type ColorDimension = {
  __typename?: 'ColorDimension';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CreatePageOperationInput = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  operationType: PageOperationType;
  templateId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreatePageTemplateInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  data: Scalars['JSON']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<PageMetadataInput>;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  class: Scalars['String']['input'];
  dept: Scalars['String']['input'];
  itemNumber: Scalars['String']['input'];
  name: Scalars['String']['input'];
  retailPriceMax: Scalars['String']['input'];
  retailPriceMin: Scalars['String']['input'];
  wholesalePriceMax: Scalars['String']['input'];
  wholesalePriceMin: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPageOperation: PageOperation;
  createPageTemplate: PageTemplate;
  createProduct: Product;
  deletePageTemplate: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  duplicatePageTemplate: PageTemplate;
  ping: Scalars['String']['output'];
  publishPageTemplate: PageTemplate;
  updatePageOperation: PageOperation;
  updatePageTemplate: PageTemplate;
  updateProduct: Product;
};


export type MutationCreatePageOperationArgs = {
  input: CreatePageOperationInput;
};


export type MutationCreatePageTemplateArgs = {
  input: CreatePageTemplateInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationDeletePageTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDuplicatePageTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPublishPageTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdatePageOperationArgs = {
  error?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  progress?: InputMaybe<Scalars['Int']['input']>;
  result?: InputMaybe<Scalars['JSON']['input']>;
  status: OperationStatus;
};


export type MutationUpdatePageTemplateArgs = {
  input: UpdatePageTemplateInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

export enum OperationStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PageMetadata = {
  __typename?: 'PageMetadata';
  componentCount: Scalars['Int']['output'];
  estimatedSize: Scalars['Int']['output'];
  lastPublished?: Maybe<Scalars['String']['output']>;
  previewUrl?: Maybe<Scalars['String']['output']>;
  publishCount: Scalars['Int']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type PageMetadataInput = {
  componentCount?: InputMaybe<Scalars['Int']['input']>;
  estimatedSize?: InputMaybe<Scalars['Int']['input']>;
  lastPublished?: InputMaybe<Scalars['String']['input']>;
  previewUrl?: InputMaybe<Scalars['String']['input']>;
  publishCount?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
};

export type PageOperation = {
  __typename?: 'PageOperation';
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  operationType: PageOperationType;
  progress: Scalars['Int']['output'];
  result?: Maybe<Scalars['JSON']['output']>;
  status: OperationStatus;
};

export enum PageOperationType {
  Create = 'CREATE',
  Delete = 'DELETE',
  Duplicate = 'DUPLICATE',
  Export = 'EXPORT',
  Import = 'IMPORT',
  Publish = 'PUBLISH',
  Update = 'UPDATE',
  Validate = 'VALIDATE'
}

export type PageTemplate = {
  __typename?: 'PageTemplate';
  author?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  data: Scalars['JSON']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  metadata?: Maybe<PageMetadata>;
  name: Scalars['String']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['String']['output'];
  version: Scalars['String']['output'];
};

export type PageTemplateConnection = {
  __typename?: 'PageTemplateConnection';
  edges: Array<PageTemplateEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageTemplateEdge = {
  __typename?: 'PageTemplateEdge';
  cursor: Scalars['String']['output'];
  node: PageTemplate;
};

export type PageTemplateFilterInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Product = {
  __typename?: 'Product';
  class: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  dept: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemNumber: Scalars['String']['output'];
  name: Scalars['String']['output'];
  retailPriceMax: Scalars['String']['output'];
  retailPriceMin: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  variants: Array<Variant>;
  wholesalePriceMax: Scalars['String']['output'];
  wholesalePriceMin: Scalars['String']['output'];
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges: Array<ProductEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node: Product;
};

export type ProductFilterInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  dept?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  colorDimensions: Array<ColorDimension>;
  health: Scalars['String']['output'];
  pageOperation?: Maybe<PageOperation>;
  pageOperations: Array<PageOperation>;
  pageTemplate?: Maybe<PageTemplate>;
  pageTemplateBySlug?: Maybe<PageTemplate>;
  pageTemplates: PageTemplateConnection;
  product?: Maybe<Product>;
  productByItemNumber?: Maybe<Product>;
  productCount: Scalars['Int']['output'];
  products: ProductConnection;
  sizeDimensions: Array<SizeDimension>;
  variant?: Maybe<Variant>;
  variants: Array<Variant>;
};


export type QueryPageOperationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPageOperationsArgs = {
  templateId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPageTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPageTemplateBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryPageTemplatesArgs = {
  filter?: InputMaybe<PageTemplateFilterInput>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductByItemNumberArgs = {
  itemNumber: Scalars['String']['input'];
};


export type QueryProductCountArgs = {
  filter?: InputMaybe<ProductFilterInput>;
};


export type QueryProductsArgs = {
  filter?: InputMaybe<ProductFilterInput>;
};


export type QueryVariantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVariantsArgs = {
  itemNumber: Scalars['String']['input'];
};

export type SizeDimension = {
  __typename?: 'SizeDimension';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type UpdatePageTemplateInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  metadata?: InputMaybe<PageMetadataInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  class?: InputMaybe<Scalars['String']['input']>;
  dept?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  itemNumber?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  retailPriceMax?: InputMaybe<Scalars['String']['input']>;
  retailPriceMin?: InputMaybe<Scalars['String']['input']>;
  wholesalePriceMax?: InputMaybe<Scalars['String']['input']>;
  wholesalePriceMin?: InputMaybe<Scalars['String']['input']>;
};

export type Variant = {
  __typename?: 'Variant';
  color: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  itemNumber: Scalars['String']['output'];
  onHandQty: Scalars['Int']['output'];
  product: Product;
  retailPrice: Scalars['Float']['output'];
  size: Scalars['String']['output'];
  skuId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  wholesalePrice: Scalars['Float']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ColorDimension: ResolverTypeWrapper<ColorDimension>;
  CreatePageOperationInput: CreatePageOperationInput;
  CreatePageTemplateInput: CreatePageTemplateInput;
  CreateProductInput: CreateProductInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OperationStatus: OperationStatus;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PageMetadata: ResolverTypeWrapper<PageMetadata>;
  PageMetadataInput: PageMetadataInput;
  PageOperation: ResolverTypeWrapper<PageOperation>;
  PageOperationType: PageOperationType;
  PageTemplate: ResolverTypeWrapper<PageTemplate>;
  PageTemplateConnection: ResolverTypeWrapper<PageTemplateConnection>;
  PageTemplateEdge: ResolverTypeWrapper<PageTemplateEdge>;
  PageTemplateFilterInput: PageTemplateFilterInput;
  Product: ResolverTypeWrapper<ProductMapper>;
  ProductConnection: ResolverTypeWrapper<Omit<ProductConnection, 'edges'> & { edges: Array<ResolversTypes['ProductEdge']> }>;
  ProductEdge: ResolverTypeWrapper<Omit<ProductEdge, 'node'> & { node: ResolversTypes['Product'] }>;
  ProductFilterInput: ProductFilterInput;
  Query: ResolverTypeWrapper<{}>;
  SizeDimension: ResolverTypeWrapper<SizeDimension>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdatePageTemplateInput: UpdatePageTemplateInput;
  UpdateProductInput: UpdateProductInput;
  Variant: ResolverTypeWrapper<VariantMapper>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ColorDimension: ColorDimension;
  CreatePageOperationInput: CreatePageOperationInput;
  CreatePageTemplateInput: CreatePageTemplateInput;
  CreateProductInput: CreateProductInput;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  PageInfo: PageInfo;
  PageMetadata: PageMetadata;
  PageMetadataInput: PageMetadataInput;
  PageOperation: PageOperation;
  PageTemplate: PageTemplate;
  PageTemplateConnection: PageTemplateConnection;
  PageTemplateEdge: PageTemplateEdge;
  PageTemplateFilterInput: PageTemplateFilterInput;
  Product: ProductMapper;
  ProductConnection: Omit<ProductConnection, 'edges'> & { edges: Array<ResolversParentTypes['ProductEdge']> };
  ProductEdge: Omit<ProductEdge, 'node'> & { node: ResolversParentTypes['Product'] };
  ProductFilterInput: ProductFilterInput;
  Query: {};
  SizeDimension: SizeDimension;
  String: Scalars['String']['output'];
  UpdatePageTemplateInput: UpdatePageTemplateInput;
  UpdateProductInput: UpdateProductInput;
  Variant: VariantMapper;
}>;

export type ColorDimensionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ColorDimension'] = ResolversParentTypes['ColorDimension']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createPageOperation?: Resolver<ResolversTypes['PageOperation'], ParentType, ContextType, RequireFields<MutationCreatePageOperationArgs, 'input'>>;
  createPageTemplate?: Resolver<ResolversTypes['PageTemplate'], ParentType, ContextType, RequireFields<MutationCreatePageTemplateArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  deletePageTemplate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePageTemplateArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  duplicatePageTemplate?: Resolver<ResolversTypes['PageTemplate'], ParentType, ContextType, RequireFields<MutationDuplicatePageTemplateArgs, 'id'>>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishPageTemplate?: Resolver<ResolversTypes['PageTemplate'], ParentType, ContextType, RequireFields<MutationPublishPageTemplateArgs, 'id'>>;
  updatePageOperation?: Resolver<ResolversTypes['PageOperation'], ParentType, ContextType, RequireFields<MutationUpdatePageOperationArgs, 'id' | 'status'>>;
  updatePageTemplate?: Resolver<ResolversTypes['PageTemplate'], ParentType, ContextType, RequireFields<MutationUpdatePageTemplateArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
}>;

export type PageInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageMetadataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageMetadata'] = ResolversParentTypes['PageMetadata']> = ResolversObject<{
  componentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  estimatedSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastPublished?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publishCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageOperationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageOperation'] = ResolversParentTypes['PageOperation']> = ResolversObject<{
  completedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  operationType?: Resolver<ResolversTypes['PageOperationType'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OperationStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageTemplateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageTemplate'] = ResolversParentTypes['PageTemplate']> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['PageMetadata']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageTemplateConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageTemplateConnection'] = ResolversParentTypes['PageTemplateConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PageTemplateEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PageTemplateEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PageTemplateEdge'] = ResolversParentTypes['PageTemplateEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PageTemplate'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  class?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dept?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  itemNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  retailPriceMax?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  retailPriceMin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variants?: Resolver<Array<ResolversTypes['Variant']>, ParentType, ContextType>;
  wholesalePriceMax?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wholesalePriceMin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductConnection'] = ResolversParentTypes['ProductConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['ProductEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductEdgeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProductEdge'] = ResolversParentTypes['ProductEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  colorDimensions?: Resolver<Array<ResolversTypes['ColorDimension']>, ParentType, ContextType>;
  health?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pageOperation?: Resolver<Maybe<ResolversTypes['PageOperation']>, ParentType, ContextType, RequireFields<QueryPageOperationArgs, 'id'>>;
  pageOperations?: Resolver<Array<ResolversTypes['PageOperation']>, ParentType, ContextType, Partial<QueryPageOperationsArgs>>;
  pageTemplate?: Resolver<Maybe<ResolversTypes['PageTemplate']>, ParentType, ContextType, RequireFields<QueryPageTemplateArgs, 'id'>>;
  pageTemplateBySlug?: Resolver<Maybe<ResolversTypes['PageTemplate']>, ParentType, ContextType, RequireFields<QueryPageTemplateBySlugArgs, 'slug'>>;
  pageTemplates?: Resolver<ResolversTypes['PageTemplateConnection'], ParentType, ContextType, Partial<QueryPageTemplatesArgs>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productByItemNumber?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductByItemNumberArgs, 'itemNumber'>>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryProductCountArgs>>;
  products?: Resolver<ResolversTypes['ProductConnection'], ParentType, ContextType, Partial<QueryProductsArgs>>;
  sizeDimensions?: Resolver<Array<ResolversTypes['SizeDimension']>, ParentType, ContextType>;
  variant?: Resolver<Maybe<ResolversTypes['Variant']>, ParentType, ContextType, RequireFields<QueryVariantArgs, 'id'>>;
  variants?: Resolver<Array<ResolversTypes['Variant']>, ParentType, ContextType, RequireFields<QueryVariantsArgs, 'itemNumber'>>;
}>;

export type SizeDimensionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SizeDimension'] = ResolversParentTypes['SizeDimension']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VariantResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Variant'] = ResolversParentTypes['Variant']> = ResolversObject<{
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  itemNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  onHandQty?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  retailPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skuId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  wholesalePrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  ColorDimension?: ColorDimensionResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageMetadata?: PageMetadataResolvers<ContextType>;
  PageOperation?: PageOperationResolvers<ContextType>;
  PageTemplate?: PageTemplateResolvers<ContextType>;
  PageTemplateConnection?: PageTemplateConnectionResolvers<ContextType>;
  PageTemplateEdge?: PageTemplateEdgeResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductConnection?: ProductConnectionResolvers<ContextType>;
  ProductEdge?: ProductEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SizeDimension?: SizeDimensionResolvers<ContextType>;
  Variant?: VariantResolvers<ContextType>;
}>;

