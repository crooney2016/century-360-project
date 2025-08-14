"use client";

import * as React from "react";
import * as ExcelJS from "exceljs";
import { Button } from "@chakra-ui/react";
import type { Table, Row } from "@tanstack/react-table";

/**
 * Export functionality extracted as atomic component
 */
export interface ExportButtonsProps<T> {
  table: Table<T>;
  visibleRows: ReadonlyArray<Row<T>>;
}

export function ExportButtons<T>({ table, visibleRows }: ExportButtonsProps<T>) {
  const generateCSV = React.useCallback((): string => {
    const cols = table.getAllLeafColumns().filter(c => c.getIsVisible());
    const headers = cols.map(c => String(c.columnDef.header ?? c.id));
    const rows = visibleRows.map(r =>
      cols.map(c => {
        const val = r.getValue(c.id);
        return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : String(val ?? "");
      })
    );
    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }, [table, visibleRows]);

  const downloadCSV = React.useCallback(() => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [generateCSV]);

  const downloadXLSX = React.useCallback(async () => {
    const cols = table.getAllLeafColumns().filter(c => c.getIsVisible());
    const headers = cols.map(c => String(c.columnDef.header ?? c.id));
    const rows = visibleRows.map(r =>
      cols.map(c => {
        const val = r.getValue(c.id);
        return val ?? "";
      })
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add headers
    worksheet.addRow(headers);

    // Add data rows
    rows.forEach(row => worksheet.addRow(row));

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }, [table, visibleRows]);

  return (
    <>
      <Button onClick={downloadCSV}>Export CSV</Button>
      <Button onClick={downloadXLSX}>Export Excel</Button>
    </>
  );
}
