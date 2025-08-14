#!/usr/bin/env tsx
import { PrismaClient } from "../src/generated/prisma";
const p = new PrismaClient();
(async () => {
  const [product, variant] = await Promise.all([p.product.count(), p.variant.count()]);
  console.log({ product, variant });
  await p.$disconnect();
})();
