"use client";

import React from "react";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ children, ...props }, ref) => (
  <table ref={ref} {...props}>
    {children}
  </table>
));
Table.displayName = "Table";

export const THead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => (
  <thead ref={ref} {...props}>
    {children}
  </thead>
));
THead.displayName = "THead";

export const TBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => (
  <tbody ref={ref} {...props}>
    {children}
  </tbody>
));
TBody.displayName = "TBody";

export const TR = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ children, ...props }, ref) => (
    <tr ref={ref} {...props}>
      {children}
    </tr>
  )
);
TR.displayName = "TR";

export const TH = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ children, ...props }, ref) => (
  <th ref={ref} {...props}>
    {children}
  </th>
));
TH.displayName = "TH";

export const TD = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ children, ...props }, ref) => (
  <td ref={ref} {...props}>
    {children}
  </td>
));
TD.displayName = "TD";
