"use client";

import * as React from "react";
import { HStack } from "@chakra-ui/react";
import { FilterControls } from "./FilterControls";
import { ColumnToggle } from "./ColumnToggle";
import { ExportButtons } from "./ExportButtons";
import type { Table, Row } from "@tanstack/react-table";

export type DataToolbarProps<T> = {
  table: Table<T>;
  search?: string;
  setSearch?: (value: string) => void;
  deptFilter?: ReadonlyArray<string>;
  setDeptFilter?: (value: ReadonlyArray<string>) => void;
  classFilter?: ReadonlyArray<string>;
  setClassFilter?: (value: ReadonlyArray<string>) => void;
  availableDepartments?: ReadonlyArray<string>;
  availableClasses?: ReadonlyArray<string>;
  visibleRows?: ReadonlyArray<Row<T>>;
};

/**
 * Data table toolbar composed of atomic filter, column, and export components
 *
 * @remarks
 * Refactored from monolithic 170-line component into composed atomic parts:
 * - FilterControls: Search + department/class filters
 * - ColumnToggle: Column visibility controls
 * - ExportButtons: CSV/Excel export functionality
 */
export function DataToolbar<T>(props: DataToolbarProps<T>): React.JSX.Element {
  const {
    table,
    search,
    setSearch,
    deptFilter,
    setDeptFilter,
    classFilter,
    setClassFilter,
    availableDepartments,
    availableClasses,
    visibleRows: propsVisibleRows,
  } = props;
  const visibleRows = propsVisibleRows ?? table.getRowModel().rows;

  return (
    <HStack flexWrap="wrap" justify="space-between" gap={2}>
      <FilterControls
        table={table}
        search={search}
        setSearch={setSearch}
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        availableDepartments={availableDepartments}
        availableClasses={availableClasses}
      />

      <HStack gap={2}>
        <ColumnToggle table={table} />
        <ExportButtons table={table} visibleRows={visibleRows} />
      </HStack>
    </HStack>
  );
}
