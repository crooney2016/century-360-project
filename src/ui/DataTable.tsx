"use client";

import * as React from "react";
import { Box, Table } from "@chakra-ui/react";
import type { Table as TanTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

export type DataTableProps<T> = {
  table: TanTable<T>;
  height?: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  bottomSlot?: React.ReactNode;
};

export default function DataTable<T>({
  table,
  height = 560,
  scrollRef,
  bottomSlot,
}: DataTableProps<T>) {
  const headers = table.getFlatHeaders();
  const rows = table.getRowModel().rows;

  return (
    <Box borderRadius="2xl" border="1px" borderColor="gray.200" bg="white" boxShadow="sm">
      <Box ref={scrollRef as React.RefObject<HTMLDivElement>} overflow="auto" maxH={height}>
        <Table minW="full">
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "#2563eb",
              color: "white",
            }}
          >
            <tr>
              {headers.map(h => (
                <th
                  key={h.id}
                  style={{
                    fontWeight: "600",
                    width: h.getSize(),
                    minWidth: h.getSize(),
                    maxWidth: h.getSize(),
                    padding: "12px",
                  }}
                >
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} data-rowid={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                      padding: "12px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
      {bottomSlot ? (
        <Box borderTop="1px" borderColor="gray.200">
          {bottomSlot}
        </Box>
      ) : null}
    </Box>
  );
}
