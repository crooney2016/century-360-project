"use client";

import * as React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import type { Product } from "../../types/catalog";
import DataTable from "../../ui/DataTable";
import { DataToolbar } from "../../ui/DataToolbar";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

const fmtMoney = (n: number | null | undefined): string =>
  n == null ? "" : `$${n.toFixed(2).replace(/\.00$/, "")}`;

const fmtPriceRange = (min: number | null | undefined, max: number | null | undefined): string => {
  if (min == null && max == null) return "";
  if (min == null) return fmtMoney(max);
  if (max == null) return fmtMoney(min);

  // If min and max are the same, show as single price
  if (Math.abs(min - max) < 0.01) {
    return fmtMoney(min);
  }

  // Show as range when there's an actual difference
  return `${fmtMoney(min)} – ${fmtMoney(max)}`;
};

export default function ProductsTable() {
  const [query, setQuery] = React.useState<string>("");
  const [deptFilter, setDeptFilter] = React.useState<ReadonlyArray<string>>([]);
  const [classFilter, setClassFilter] = React.useState<ReadonlyArray<string>>([]);
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 50;

  // Debounce search query
  const [debouncedQuery, setDebouncedQuery] = React.useState<string>("");
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Get dimension data for filtering
  const [dimensions, setDimensions] = React.useState<{
    departments: string[];
    classes: string[];
    deptClasses: Record<string, string[]>;
  } | null>(null);

  // Fetch dimensions data
  React.useEffect(() => {
    fetch("/api/admin/dimensions")
      .then(r => r.json())
      .then(setDimensions);
  }, []);

  // Build API URL with filters
  const apiUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    params.set("take", pageSize.toString());
    params.set("page", page.toString());

    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    }
    if (deptFilter.length > 0) {
      params.set("dept", deptFilter.join(","));
    }
    if (classFilter.length > 0) {
      params.set("class", classFilter.join(","));
    }

    return `/api/admin/products?${params.toString()}`;
  }, [debouncedQuery, deptFilter, classFilter, page, pageSize]);

  // Fetch products data
  const [data, setData] = React.useState<{
    items: Product[];
    total: number;
    totalPages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    console.log("Fetching products from:", apiUrl);
    setIsLoading(true);
    fetch(apiUrl)
      .then(r => r.json())
      .then(result => {
        console.log("Products data received:", result);
        setData(result);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setIsLoading(false));
  }, [apiUrl]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  // Get available classes based on selected departments
  const availableClasses = React.useMemo(() => {
    if (!dimensions || deptFilter.length === 0) {
      return dimensions?.classes || [];
    }
    const classes = new Set<string>();
    deptFilter.forEach(dept => {
      const deptClasses = dimensions.deptClasses[dept] || [];
      deptClasses.forEach(cls => classes.add(cls));
    });
    return Array.from(classes);
  }, [dimensions, deptFilter]);

  const columnHelper = createColumnHelper<Product>();
  const columns = React.useMemo(() => {
    return [
      columnHelper.accessor("ItemNumber", {
        header: "Item #",
        cell: ctx => ctx.getValue(),
        size: 80,
        minSize: 80,
        maxSize: 100,
      }),
      columnHelper.accessor("Name", {
        header: "Name",
        cell: ctx => ctx.getValue(),
        size: 300,
        minSize: 250,
        maxSize: 400,
      }),
      columnHelper.accessor("Dept", {
        header: "Dept",
        cell: ctx => ctx.getValue(),
        size: 120,
        minSize: 100,
        maxSize: 150,
      }),
      columnHelper.accessor("Class", {
        header: "Class",
        cell: ctx => ctx.getValue(),
        size: 140,
        minSize: 120,
        maxSize: 180,
      }),
      columnHelper.display({
        id: "RetailRange",
        header: "Retail",
        size: 100,
        minSize: 80,
        maxSize: 120,
        cell: ctx => {
          const r = ctx.row.original;
          return fmtPriceRange(r.RetailPriceMin, r.RetailPriceMax);
        },
      }),
      columnHelper.display({
        id: "WholesaleRange",
        header: "Wholesale",
        size: 100,
        minSize: 80,
        maxSize: 120,
        cell: ctx => {
          const r = ctx.row.original;
          return fmtPriceRange(r.WholesalePriceMin, r.WholesalePriceMax);
        },
      }),
    ];
  }, [columnHelper]);

  const table = useReactTable<Product>({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: r => r.id,
    columnResizeMode: "onChange",
  });

  // Reset to first page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, deptFilter, classFilter]);

  // Reset class filter when department filter changes
  React.useEffect(() => {
    setClassFilter([]);
  }, [deptFilter]);

  return (
    <VStack gap={2} align="stretch">
      <DataToolbar<Product>
        table={table}
        search={query}
        setSearch={setQuery}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        availableDepartments={dimensions?.departments || []}
        availableClasses={availableClasses}
        visibleRows={table.getRowModel().rows}
      />
      <Box bg="white" border="1px" borderColor="gray.200" borderRadius="2xl" boxShadow="sm">
        <Box overflow="auto" maxH="600px">
          <DataTable<Product> table={table} height={600} />
        </Box>
        {isLoading && (
          <Text px={3} py={2} fontSize="sm" textAlign="center" color="gray.500">
            Loading...
          </Text>
        )}
        {!isLoading && totalPages > 1 && (
          <Text
            px={3}
            py={2}
            fontSize="sm"
            textAlign="center"
            color="gray.500"
            borderTop="1px"
            borderColor="gray.200"
          >
            Page {page} of {totalPages} • {total} total products
          </Text>
        )}
      </Box>
    </VStack>
  );
}
