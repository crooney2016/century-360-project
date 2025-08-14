"use client";

import * as React from "react";
import { Button } from "@chakra-ui/react";
import { cn } from "./cn";
import type { Table } from "@tanstack/react-table";

/**
 * Column visibility toggle extracted as atomic component
 */
export interface ColumnToggleProps<T> {
  table: Table<T>;
}

export function ColumnToggle<T>({ table }: ColumnToggleProps<T>) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(v => !v)}>
        Columns
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[22rem] rounded-xl border bg-white p-3 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {table.getAllLeafColumns().map(col => {
              const label = String(col.columnDef.header ?? col.id);
              const isVisible = col.getIsVisible();
              return (
                <button
                  key={col.id}
                  onClick={() => col.toggleVisibility()}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm border",
                    isVisible
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                  title={label}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
