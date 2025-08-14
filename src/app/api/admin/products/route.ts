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
  const deptFilter = searchParams.get("dept") || null;
  const classFilter = searchParams.get("class") || null;

  const skip = (page - 1) * take;

  // Build where clause for filtering
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { Name: { contains: search } },
      { ItemNumber: { contains: search } },
      { Dept: { contains: search } },
      { Class: { contains: search } },
    ];
  }

  if (deptFilter) {
    const depts = deptFilter.split(",");
    where.Dept = { in: depts };
  }

  if (classFilter) {
    const classes = classFilter.split(",");
    where.Class = { in: classes };
  }

  try {
    // Get total count for pagination
    const total = await prisma.product.count({ where });
    const totalPages = Math.ceil(total / take);

    const items = await prisma.product.findMany({
      where,
      orderBy: { id: "asc" },
      skip,
      take,
      select: {
        id: true,
        ItemNumber: true,
        Name: true,
        Dept: true,
        Class: true,
        RetailPriceMin: true,
        RetailPriceMax: true,
        WholesalePriceMin: true,
        WholesalePriceMax: true,
      },
    });

    // Convert Decimal to number for JSON serialization
    const serializedItems = items.map(item => ({
      ...item,
      RetailPriceMin: parseFloat(item.RetailPriceMin.toString()),
      RetailPriceMax: parseFloat(item.RetailPriceMax.toString()),
      WholesalePriceMin: item.WholesalePriceMin
        ? parseFloat(item.WholesalePriceMin.toString())
        : null,
      WholesalePriceMax: item.WholesalePriceMax
        ? parseFloat(item.WholesalePriceMax.toString())
        : null,
    }));

    return NextResponse.json({
      items: serializedItems,
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
