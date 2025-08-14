import { z } from "zod";

export const numberCoerce = z.preprocess(
  v => (v === "" || v == null ? undefined : Number(v)),
  z.number()
);
export const numberCoerceNull = z.preprocess(
  v => (v === "" || v == null ? null : Number(v)),
  z.number().nullable()
);

export const ProductSchema = z.object({
  id: z.string(),
  ItemNumber: z.string(),
  Name: z.string(),
  Dept: z
    .string()
    .optional()
    .nullable()
    .transform(v => v ?? ""),
  Class: z
    .string()
    .optional()
    .nullable()
    .transform(v => v ?? ""),
  RetailPriceMin: numberCoerce,
  RetailPriceMax: numberCoerce,
  WholesalePriceMin: numberCoerceNull,
  WholesalePriceMax: numberCoerceNull,
});
export type Product = z.infer<typeof ProductSchema>;

export const VariantSchema = z.object({
  id: z.string(),
  SkuId: z.string(),
  ItemNumber: z.string(),
  Color: z
    .string()
    .optional()
    .nullable()
    .transform(v => v ?? null),
  Size: z
    .string()
    .optional()
    .nullable()
    .transform(v => v ?? null),
  RetailPrice: numberCoerceNull,
  WholesalePrice: numberCoerceNull,
  OnHandQty: numberCoerce,
  ProductId: z.string(),
});
export type Variant = z.infer<typeof VariantSchema>;

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const pageSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  });
