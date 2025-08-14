import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const take = parseInt(searchParams.get("take") || "50");
    const search = searchParams.get("search") || "";
    const dept = searchParams.get("dept") || "";
    const classFilter = searchParams.get("class") || "";

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

    return NextResponse.json({
      products,
      pagination: {
        page,
        take,
        totalCount,
        hasNextPage,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        ItemNumber: body.ItemNumber,
        Name: body.Name,
        Dept: body.Dept,
        Class: body.Class,
        RetailPriceMin: body.RetailPriceMin,
        RetailPriceMax: body.RetailPriceMax,
        WholesalePriceMin: body.WholesalePriceMin,
        WholesalePriceMax: body.WholesalePriceMax,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
