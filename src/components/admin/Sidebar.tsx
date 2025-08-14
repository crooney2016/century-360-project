"use client";
import NavLink from "../../ui/NavLink";

export function Sidebar() {
  return (
    <div className="p-4">
      <div className="mb-3 text-xs font-medium text-gray-500 uppercase">Admin</div>
      <nav className="flex flex-col gap-1">
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/variants">Variants</NavLink>
        <NavLink href="/dev/seed-status">Seed status</NavLink>
        <NavLink href="/admin/docs">UI docs</NavLink>
      </nav>
    </div>
  );
}
