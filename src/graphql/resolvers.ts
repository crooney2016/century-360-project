import { prisma } from "@/lib/prisma";
import PageStorageService, { PageTemplate } from "../lib/page-storage";

// Initialize storage service
const pageStorage = new PageStorageService({ type: "local" });

export const resolvers = {
  Query: {
    // Product queries using Prisma
    products: async (_: any, { filter }: { filter?: any }) => {
      try {
        const {
          search = "",
          dept = "",
          class: classFilter = "",
          page = 1,
          take = 50,
        } = filter || {};

        const skip = (page - 1) * take;

        // Build where clause for filtering
        const where: any = {};

        if (search) {
          where.OR = [
            { Name: { contains: search, mode: "insensitive" } },
            { ItemNumber: { contains: search, mode: "insensitive" } },
            { Dept: { contains: search, mode: "insensitive" } },
            { Class: { contains: search, mode: "insensitive" } },
          ];
        }

        if (dept) {
          where.Dept = { equals: dept, mode: "insensitive" };
        }

        if (classFilter) {
          where.Class = { equals: classFilter, mode: "insensitive" };
        }

        // Get total count for pagination
        const totalCount = await prisma.product.count({ where });

        // Get products with pagination and filtering
        const products = await prisma.product.findMany({
          where,
          take,
          skip,
          orderBy: {
            CreatedAt: "desc",
          },
          include: {
            variants: {
              take: 5, // Limit variants to avoid large responses
              orderBy: {
                CreatedAt: "desc",
              },
            },
          },
        });

        const hasNextPage = skip + take < totalCount;
        const totalPages = Math.ceil(totalCount / take);

        return {
          edges: products.map((product, index) => ({
            node: {
              id: product.id,
              itemNumber: product.ItemNumber,
              name: product.Name,
              dept: product.Dept,
              class: product.Class,
              retailPriceMin: product.RetailPriceMin,
              retailPriceMax: product.RetailPriceMax,
              wholesalePriceMin: product.WholesalePriceMin,
              wholesalePriceMax: product.WholesalePriceMax,
              createdAt: product.CreatedAt.toISOString(),
              updatedAt: product.UpdatedAt.toISOString(),
              variants: product.variants.map(variant => ({
                id: variant.id,
                itemNumber: variant.ItemNumber,
                skuId: variant.SkuId,
                color: variant.Color,
                size: variant.Size,
                retailPrice: parseFloat(variant.RetailPrice.toString()),
                wholesalePrice: parseFloat(variant.WholesalePrice.toString()),
                onHandQty: variant.OnHandQty,
                createdAt: variant.CreatedAt.toISOString(),
                updatedAt: variant.UpdatedAt.toISOString(),
                product: null, // Avoid circular reference
              })),
            },
            cursor: `${skip + index}`,
          })),
          pageInfo: {
            hasNextPage,
            hasPreviousPage: page > 1,
            startCursor: skip.toString(),
            endCursor: (skip + products.length - 1).toString(),
            page,
            totalPages,
            totalCount,
          },
          totalCount,
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    },

    product: async (_: any, { id }: { id: string }) => {
      try {
        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            variants: {
              orderBy: {
                CreatedAt: "desc",
              },
            },
          },
        });

        if (!product) return null;

        return {
          id: product.id,
          itemNumber: product.ItemNumber,
          name: product.Name,
          dept: product.Dept,
          class: product.Class,
          retailPriceMin: product.RetailPriceMin,
          retailPriceMax: product.RetailPriceMax,
          wholesalePriceMin: product.WholesalePriceMin,
          wholesalePriceMax: product.WholesalePriceMax,
          createdAt: product.CreatedAt.toISOString(),
          updatedAt: product.UpdatedAt.toISOString(),
          variants: product.variants.map(variant => ({
            id: variant.id,
            itemNumber: variant.ItemNumber,
            skuId: variant.SkuId,
            color: variant.Color,
            size: variant.Size,
            retailPrice: parseFloat(variant.RetailPrice.toString()),
            wholesalePrice: parseFloat(variant.WholesalePrice.toString()),
            onHandQty: variant.OnHandQty,
            createdAt: variant.CreatedAt.toISOString(),
            updatedAt: variant.UpdatedAt.toISOString(),
            product: null, // Avoid circular reference
          })),
        };
      } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error("Failed to fetch product");
      }
    },

    productByItemNumber: async (_: any, { itemNumber }: { itemNumber: string }) => {
      try {
        const product = await prisma.product.findUnique({
          where: { ItemNumber: itemNumber },
          include: {
            variants: {
              orderBy: {
                CreatedAt: "desc",
              },
            },
          },
        });

        if (!product) return null;

        return {
          id: product.id,
          itemNumber: product.ItemNumber,
          name: product.Name,
          dept: product.Dept,
          class: product.Class,
          retailPriceMin: product.RetailPriceMin,
          retailPriceMax: product.RetailPriceMax,
          wholesalePriceMin: product.WholesalePriceMin,
          wholesalePriceMax: product.WholesalePriceMax,
          createdAt: product.CreatedAt.toISOString(),
          updatedAt: product.UpdatedAt.toISOString(),
          variants: product.variants.map(variant => ({
            id: variant.id,
            itemNumber: variant.ItemNumber,
            skuId: variant.SkuId,
            color: variant.Color,
            size: variant.Size,
            retailPrice: parseFloat(variant.RetailPrice.toString()),
            wholesalePrice: parseFloat(variant.WholesalePrice.toString()),
            onHandQty: variant.OnHandQty,
            createdAt: variant.CreatedAt.toISOString(),
            updatedAt: variant.UpdatedAt.toISOString(),
            product: null, // Avoid circular reference
          })),
        };
      } catch (error) {
        console.error("Error fetching product by item number:", error);
        throw new Error("Failed to fetch product");
      }
    },

    productCount: async (_: any, { filter }: { filter?: any }) => {
      try {
        const { search = "", dept = "", class: classFilter = "" } = filter || {};

        const where: any = {};

        if (search) {
          where.OR = [
            { Name: { contains: search, mode: "insensitive" } },
            { ItemNumber: { contains: search, mode: "insensitive" } },
            { Dept: { contains: search, mode: "insensitive" } },
            { Class: { contains: search, mode: "insensitive" } },
          ];
        }

        if (dept) {
          where.Dept = { equals: dept, mode: "insensitive" };
        }

        if (classFilter) {
          where.Class = { equals: classFilter, mode: "insensitive" };
        }

        return await prisma.product.count({ where });
      } catch (error) {
        console.error("Error counting products:", error);
        throw new Error("Failed to count products");
      }
    },

    // Variant queries
    variants: async (_: any, { itemNumber }: { itemNumber: string }) => {
      try {
        const variants = await prisma.variant.findMany({
          where: { ItemNumber: itemNumber },
          orderBy: {
            CreatedAt: "desc",
          },
        });

        return variants.map(variant => ({
          id: variant.id,
          itemNumber: variant.ItemNumber,
          skuId: variant.SkuId,
          color: variant.Color,
          size: variant.Size,
          retailPrice: parseFloat(variant.RetailPrice.toString()),
          wholesalePrice: parseFloat(variant.WholesalePrice.toString()),
          onHandQty: variant.OnHandQty,
          createdAt: variant.CreatedAt.toISOString(),
          updatedAt: variant.UpdatedAt.toISOString(),
          product: null, // Avoid circular reference
        }));
      } catch (error) {
        console.error("Error fetching variants:", error);
        throw new Error("Failed to fetch variants");
      }
    },

    variant: async (_: any, { id }: { id: string }) => {
      try {
        const variant = await prisma.variant.findUnique({
          where: { id },
        });

        if (!variant) return null;

        return {
          id: variant.id,
          itemNumber: variant.ItemNumber,
          skuId: variant.SkuId,
          color: variant.Color,
          size: variant.Size,
          retailPrice: parseFloat(variant.RetailPrice.toString()),
          wholesalePrice: parseFloat(variant.WholesalePrice.toString()),
          onHandQty: variant.OnHandQty,
          createdAt: variant.CreatedAt.toISOString(),
          updatedAt: variant.UpdatedAt.toISOString(),
          product: null, // Avoid circular reference
        };
      } catch (error) {
        console.error("Error fetching variant:", error);
        throw new Error("Failed to fetch variant");
      }
    },

    // Dimension queries
    colorDimensions: async () => {
      try {
        const colors = await prisma.colorDimension.findMany({
          orderBy: { Name: "asc" },
        });

        return colors.map(color => ({
          id: color.id,
          name: color.Name,
          createdAt: color.CreatedAt.toISOString(),
          updatedAt: color.UpdatedAt.toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching color dimensions:", error);
        throw new Error("Failed to fetch color dimensions");
      }
    },

    sizeDimensions: async () => {
      try {
        const sizes = await prisma.sizeDimension.findMany({
          orderBy: { Name: "asc" },
        });

        return sizes.map(size => ({
          id: size.id,
          name: size.Name,
          createdAt: size.CreatedAt.toISOString(),
          updatedAt: size.UpdatedAt.toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching size dimensions:", error);
        throw new Error("Failed to fetch size dimensions");
      }
    },

    // Health check
    health: () => "OK",

    // Page template queries
    pageTemplates: async (_: any, { filter }: { filter?: any }) => {
      try {
        const templates = await pageStorage.getAllTemplates();
        return {
          edges: templates.map((template, index) => ({
            node: template,
            cursor: index.toString(),
          })),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "0",
            endCursor: (templates.length - 1).toString(),
            page: 1,
            totalPages: 1,
            totalCount: templates.length,
          },
          totalCount: templates.length,
        };
      } catch (error) {
        console.error("Error fetching page templates:", error);
        throw new Error("Failed to fetch page templates");
      }
    },

    pageTemplate: async (_: any, { id }: { id: string }) => {
      try {
        return await pageStorage.getTemplate(id);
      } catch (error) {
        console.error("Error fetching page template:", error);
        throw new Error("Failed to fetch page template");
      }
    },

    pageTemplateBySlug: async (_: any, { slug }: { slug: string }) => {
      try {
        const templates = await pageStorage.getAllTemplates();
        return templates.find(t => t.name === slug) || null;
      } catch (error) {
        console.error("Error fetching page template by slug:", error);
        throw new Error("Failed to fetch page template by slug");
      }
    },

    // Page operation queries
    pageOperations: async (_: any, { templateId }: { templateId?: string }) => {
      try {
        // Mock operations - replace with actual implementation
        return [];
      } catch (error) {
        console.error("Error fetching page operations:", error);
        throw new Error("Failed to fetch page operations");
      }
    },

    pageOperation: async (_: any, { id }: { id: string }) => {
      try {
        // Mock operation - replace with actual implementation
        return {
          id,
          operationType: "CREATE",
          status: "COMPLETED",
          progress: 100,
          result: { success: true },
          error: null,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Error fetching page operation:", error);
        throw new Error("Failed to fetch page operation");
      }
    },
  },

  Mutation: {
    // Product mutations using Prisma
    createProduct: async (_: any, { input }: { input: any }) => {
      try {
        const product = await prisma.product.create({
          data: {
            ItemNumber: input.itemNumber,
            Name: input.name,
            Dept: input.dept,
            Class: input.class,
            RetailPriceMin: input.retailPriceMin,
            RetailPriceMax: input.retailPriceMax,
            WholesalePriceMin: input.wholesalePriceMin,
            WholesalePriceMax: input.wholesalePriceMax,
          },
        });

        return {
          id: product.id,
          itemNumber: product.ItemNumber,
          name: product.Name,
          dept: product.Dept,
          class: product.Class,
          retailPriceMin: product.RetailPriceMin,
          retailPriceMax: product.RetailPriceMax,
          wholesalePriceMin: product.WholesalePriceMin,
          wholesalePriceMax: product.WholesalePriceMax,
          createdAt: product.CreatedAt.toISOString(),
          updatedAt: product.UpdatedAt.toISOString(),
          variants: [],
        };
      } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
      }
    },

    updateProduct: async (_: any, { input }: { input: any }) => {
      try {
        const product = await prisma.product.update({
          where: { id: input.id },
          data: {
            ...(input.itemNumber && { ItemNumber: input.itemNumber }),
            ...(input.name && { Name: input.name }),
            ...(input.dept && { Dept: input.dept }),
            ...(input.class && { Class: input.class }),
            ...(input.retailPriceMin && { RetailPriceMin: input.retailPriceMin }),
            ...(input.retailPriceMax && { RetailPriceMax: input.retailPriceMax }),
            ...(input.wholesalePriceMin && { WholesalePriceMin: input.wholesalePriceMin }),
            ...(input.wholesalePriceMax && { WholesalePriceMax: input.wholesalePriceMax }),
          },
        });

        return {
          id: product.id,
          itemNumber: product.ItemNumber,
          name: product.Name,
          dept: product.Dept,
          class: product.Class,
          retailPriceMin: product.RetailPriceMin,
          retailPriceMax: product.RetailPriceMax,
          wholesalePriceMin: product.WholesalePriceMin,
          wholesalePriceMax: product.WholesalePriceMax,
          createdAt: product.CreatedAt.toISOString(),
          updatedAt: product.UpdatedAt.toISOString(),
          variants: [],
        };
      } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.product.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
      }
    },

    // Page template mutations
    createPageTemplate: async (_: any, { input }: { input: any }) => {
      try {
        const template = await pageStorage.saveTemplate({
          ...input,
          isPublic: input.isPublic ?? false,
          author: input.author ?? "current-user",
        });
        return template;
      } catch (error) {
        console.error("Error creating page template:", error);
        throw new Error("Failed to create page template");
      }
    },

    updatePageTemplate: async (_: any, { input }: { input: any }) => {
      try {
        const template = await pageStorage.updateTemplate(input.id, input);
        if (!template) {
          throw new Error("Page template not found");
        }
        return template;
      } catch (error) {
        console.error("Error updating page template:", error);
        throw new Error("Failed to update page template");
      }
    },

    deletePageTemplate: async (_: any, { id }: { id: string }) => {
      try {
        return await pageStorage.deleteTemplate(id);
      } catch (error) {
        console.error("Error deleting page template:", error);
        throw new Error("Failed to delete page template");
      }
    },

    duplicatePageTemplate: async (_: any, { id }: { id: string }) => {
      try {
        const original = await pageStorage.getTemplate(id);
        if (!original) {
          throw new Error("Page template not found");
        }

        const duplicate = await pageStorage.saveTemplate({
          name: `${original.name} (Copy)`,
          description: `${original.description} (Copy)`,
          data: original.data,
          tags: original.tags,
          category: original.category,
          isPublic: false,
          author: "current-user",
          version: "1.0.0",
        });

        return duplicate;
      } catch (error) {
        console.error("Error duplicating page template:", error);
        throw new Error("Failed to duplicate page template");
      }
    },

    publishPageTemplate: async (_: any, { id }: { id: string }) => {
      try {
        const template = await pageStorage.getTemplate(id);
        if (!template) {
          throw new Error("Page template not found");
        }

        // Mock publishing - return the template as published
        return template;
      } catch (error) {
        console.error("Error publishing page template:", error);
        throw new Error("Failed to publish page template");
      }
    },

    // Page operation mutations
    createPageOperation: async (_: any, { input }: { input: any }) => {
      try {
        // Mock operation creation
        return {
          id: `op_${Date.now()}`,
          operationType: input.operationType,
          status: "PENDING",
          progress: 0,
          result: null,
          error: null,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
      } catch (error) {
        console.error("Error creating page operation:", error);
        throw new Error("Failed to create page operation");
      }
    },

    updatePageOperation: async (
      _: any,
      {
        id,
        status,
        progress,
        result,
        error,
      }: { id: string; status: string; progress?: number; result?: any; error?: string }
    ) => {
      try {
        // Mock operation update
        return {
          id,
          operationType: "CREATE",
          status,
          progress: progress || 0,
          result,
          error,
          createdAt: new Date().toISOString(),
          completedAt: status === "COMPLETED" ? new Date().toISOString() : null,
        };
      } catch (error) {
        console.error("Error updating page operation:", error);
        throw new Error("Failed to update page operation");
      }
    },

    // Health check
    ping: () => "pong",
  },
};
