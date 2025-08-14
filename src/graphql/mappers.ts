// Type mappers for GraphQL resolvers
export interface ProductMapper {
  id: string;
  ItemNumber: string;
  Name: string;
  Dept: string;
  Class: string;
  RetailPriceMin: string;
  RetailPriceMax: string;
  WholesalePriceMin: string;
  WholesalePriceMax: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export interface VariantMapper {
  id: string;
  ItemNumber: string;
  SkuId: string;
  Color: string;
  Size: string;
  RetailPrice: number;
  WholesalePrice: number;
  OnHandQty: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}
