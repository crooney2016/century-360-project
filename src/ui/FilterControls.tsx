"use client";

import * as React from "react";
import { HStack, Input } from "@chakra-ui/react";
import { MultiSelect, type Option } from "./MultiSelect";
import type { Table } from "@tanstack/react-table";

/**
 * Filter controls extracted as atomic component
 */
export interface FilterControlsProps<T> {
  table: Table<T>;
  search?: string;
  setSearch?: (value: string) => void;
  deptFilter?: ReadonlyArray<string>;
  setDeptFilter?: (value: ReadonlyArray<string>) => void;
  classFilter?: ReadonlyArray<string>;
  setClassFilter?: (value: ReadonlyArray<string>) => void;
  availableDepartments?: ReadonlyArray<string>;
  availableClasses?: ReadonlyArray<string>;
}

export function FilterControls<T>({
  table,
  search,
  setSearch,
  deptFilter,
  setDeptFilter,
  classFilter,
  setClassFilter,
  availableDepartments,
  availableClasses,
}: FilterControlsProps<T>) {
  const global = search ?? (table.getState() as { globalFilter?: string }).globalFilter ?? "";
  const setGlobal = (v: string) => {
    if (setSearch) {
      setSearch(v);
    } else {
      table.setGlobalFilter(v);
    }
  };

  const deptOptions: ReadonlyArray<Option> = React.useMemo(() => {
    if (!availableDepartments) return [];
    return availableDepartments.map(d => ({ label: d, value: d }));
  }, [availableDepartments]);

  const classOptions: ReadonlyArray<Option> = React.useMemo(() => {
    if (!availableClasses) return [];
    return availableClasses.map(c => ({ label: c, value: c }));
  }, [availableClasses]);

  return (
    <HStack flex={1} minW={0} gap={2} align="center">
      <Input
        placeholder="Search products…"
        value={global}
        onChange={e => setGlobal(e.target.value)}
        w="380px"
      />

      <MultiSelect
        buttonLabel="Departments"
        options={deptOptions}
        value={deptFilter || []}
        onChange={setDeptFilter || (() => {})}
      />

      <MultiSelect
        buttonLabel="Classes"
        options={classOptions}
        value={classFilter || []}
        onChange={setClassFilter || (() => {})}
      />
    </HStack>
  );
}
