export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function SeedStatus() {
  const [product, variant] = await Promise.all([prisma.product.count(), prisma.variant.count()]);
  return (
    <div className="py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Seed status</h1>
      <pre className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
        {JSON.stringify({ product, variant }, null, 2)}
      </pre>
    </div>
  );
}
