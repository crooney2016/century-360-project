import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all unique departments
    const departments = await prisma.product.findMany({
      select: { Dept: true },
      distinct: ["Dept"],
      orderBy: { Dept: "asc" },
    });

    // Get all unique classes
    const classes = await prisma.product.findMany({
      select: { Class: true },
      distinct: ["Class"],
      orderBy: { Class: "asc" },
    });

    // Get department-class relationships for cross-filtering
    const deptClassMap = await prisma.product.findMany({
      select: { Dept: true, Class: true },
      distinct: ["Dept", "Class"],
      orderBy: [{ Dept: "asc" }, { Class: "asc" }],
    });

    // Group classes by department
    const deptClasses = deptClassMap.reduce(
      (acc, item) => {
        if (!acc[item.Dept]) {
          acc[item.Dept] = [];
        }
        if (!acc[item.Dept].includes(item.Class)) {
          acc[item.Dept].push(item.Class);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    return NextResponse.json({
      departments: departments.map(d => d.Dept).filter(Boolean),
      classes: classes.map(c => c.Class).filter(Boolean),
      deptClasses,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
