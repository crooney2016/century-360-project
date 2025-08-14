"use client";

import { ComingSoon } from "@/components/molecules/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports & Analytics"
      description="Generate comprehensive reports and analyze your business performance."
      todos={[
        "Build interactive dashboard with key metrics",
        "Create sales and revenue reporting",
        "Implement product performance analytics",
        "Add customer behavior insights",
        "Build custom report builder",
        "Create automated report scheduling",
        "Add data export in multiple formats (PDF, Excel, CSV)",
      ]}
      fallbackRoute="/admin"
    />
  );
}
