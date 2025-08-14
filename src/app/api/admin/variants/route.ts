import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const takeParam = Number(searchParams.get("take") ?? "50");
  const take = Math.max(1, Math.min(100, isFinite(takeParam) ? takeParam : 50));
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Math.max(1, isFinite(pageParam) ? pageParam : 1);
  const search = searchParams.get("search") || null;

  const skip = (page - 1) * take;

  // Build where clause for filtering
  const where: Prisma.VariantWhereInput = {};

  if (search) {
    where.OR = [
      { SkuId: { contains: search } },
      { ItemNumber: { contains: search } },
      { Color: { contains: search } },
      { Size: { contains: search } },
    ];
  }

  try {
    // Get total count for pagination
    const total = await prisma.variant.count({ where });
    const totalPages = Math.ceil(total / take);

    const items = await prisma.variant.findMany({
      where,
      orderBy: [{ ItemNumber: "asc" }, { Color: "asc" }, { Size: "asc" }],
      skip,
      take,
      select: {
        id: true,
        SkuId: true,
        ItemNumber: true,
        Color: true,
        Size: true,
        RetailPrice: true,
        WholesalePrice: true,
        OnHandQty: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    });

    return NextResponse.json({
      variants: items,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
