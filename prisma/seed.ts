/// <reference types="node" />
// Seed the database from "prisma/seed-data.csv"
// Rules:
// - Product upsert by ItemNumber (REQUIRES name column in CSV: "Product Name" or "Item Name")
// - Variant upsert by SkuId = ItemNumber-<Color><Size> (if no Color/Size => just ItemNumber)
// - Color/Size are OPTIONAL (stored as strings; no joins)

import { PrismaClient } from '../src/generated/prisma';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

type CsvRow = Record<string, string>;

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data (with error handling)
    console.log('🧹 Clearing existing data...');
    try {
      await prisma.variant.deleteMany();
      await prisma.product.deleteMany();
      await prisma.colorDimension.deleteMany();
      await prisma.sizeDimension.deleteMany();
    } catch {
      console.log('ℹ️  No existing data to clear (this is normal for first run)');
    }

    // Read and parse CSV data
    const csvFilePath = path.join(__dirname, 'seed-data.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');

    const records: CsvRow[] = await new Promise((resolve, reject) => {
      parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true, // Handle BOM
      }, (err, records) => {
        if (err) reject(err);
        else resolve(records as CsvRow[]);
      });
    });

    console.log(`📊 Found ${records.length} records in CSV`);
    
    // Debug: Show first few records
    console.log('🔍 First 3 records:');
    records.slice(0, 3).forEach((record, index) => {
      console.log(`  Record ${index + 1}:`, {
        'Item ID': record['Item ID'],
        'Item Name': record['Item Name'],
        'Department': record['Department'],
        'Class': record['Class'],
        'Color Name': record['Color Name'],
        'Size Name': record['Size Name'],
        'Retail Price': record['Retail Price'],
        'Wholesale Price': record['Wholesale Price'],
        'On Hand #': record['On Hand #']
      });
    });

    // Extract unique colors and sizes for dimensions
    const uniqueColors = new Set<string>();
    const uniqueSizes = new Set<string>();

    records.forEach(record => {
      if (record['Color Name'] && record['Color Name'].trim()) {
        uniqueColors.add(record['Color Name'].trim());
      }
      if (record['Size Name'] && record['Size Name'].trim()) {
        uniqueSizes.add(record['Size Name'].trim());
      }
    });

    // Create color dimensions
    console.log('🎨 Creating color dimensions...');
    for (const color of uniqueColors) {
      await prisma.colorDimension.create({
        data: { Name: color }
      });
    }

    // Create size dimensions
    console.log('📏 Creating size dimensions...');
    for (const size of uniqueSizes) {
      await prisma.sizeDimension.create({
        data: { Name: size }
      });
    }

    // Group records by Item ID to create products
    const productGroups = new Map<string, CsvRow[]>();
    
    records.forEach(record => {
      const itemNumber = record['Item ID']?.trim();
      if (itemNumber) {
        if (!productGroups.has(itemNumber)) {
          productGroups.set(itemNumber, []);
        }
        productGroups.get(itemNumber)!.push(record);
      }
    });

    console.log(`🏷️  Creating ${productGroups.size} products...`);
    
    // Debug: Show first few product groups
    console.log('🔍 First 3 product groups:');
    let count = 0;
    for (const [itemNumber, variants] of productGroups) {
      if (count >= 3) break;
      console.log(`  Item ${itemNumber}: ${variants.length} variants`);
      count++;
    }

    // Create products and variants
    let productsCreated = 0;
    let variantsCreated = 0;

    for (const [itemNumber, variants] of productGroups) {
      if (variants.length === 0) continue;

      const firstVariant = variants[0];
      
      // Calculate price ranges (as strings)
      const retailPrices = variants
        .map(v => parseFloat(v['Retail Price']?.replace(/[$,]/g, '') || '0'))
        .filter(p => !isNaN(p));
      
      const wholesalePrices = variants
        .map(v => parseFloat(v['Wholesale Price']?.replace(/[$,]/g, '') || '0'))
        .filter(p => !isNaN(p));

      const retailPriceMin = retailPrices.length > 0 ? Math.min(...retailPrices).toString() : '0';
      const retailPriceMax = retailPrices.length > 0 ? Math.max(...retailPrices).toString() : '0';
      const wholesalePriceMin = wholesalePrices.length > 0 ? Math.min(...wholesalePrices).toString() : '0';
      const wholesalePriceMax = wholesalePrices.length > 0 ? Math.max(...wholesalePrices).toString() : '0';

      // Create or update product
      await prisma.product.create({
        data: {
          ItemNumber: itemNumber,
          Name: firstVariant['Item Name'] || 'Unknown Product',
          Dept: firstVariant['Department'] || 'Unknown',
          Class: firstVariant['Class'] || 'Unknown',
          RetailPriceMin: retailPriceMin,
          RetailPriceMax: retailPriceMax,
          WholesalePriceMin: wholesalePriceMin,
          WholesalePriceMax: wholesalePriceMax,
        },
      });
      productsCreated++;

      // Create variants for this product
      for (const variant of variants) {
        // Generate SKU ID
        const colorPart = variant['Color Name'] ? variant['Color Name'].replace(/\s+/g, "") : "";
        const sizePart = variant['Size Name'] ? variant['Size Name'].replace(/\s+/g, "") : "";
        const skuId = `${itemNumber}-${colorPart}${sizePart}`;

        await prisma.variant.create({
          data: {
            ItemNumber: itemNumber,
            SkuId: skuId,
            Color: variant['Color Name'] || "",
            Size: variant['Size Name'] || "",
            RetailPrice: parseFloat(variant['Retail Price']?.replace(/[$,]/g, '') || '0'),
            WholesalePrice: parseFloat(variant['Wholesale Price']?.replace(/[$,]/g, '') || '0'),
            OnHandQty: parseInt(variant['On Hand #']?.replace(/[,]/g, '') || '0'),
          },
        });
        variantsCreated++;
      }
    }

    console.log("🎉 Product data seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`   Products: ${productsCreated} created`);
    console.log(`   Variants: ${variantsCreated} created`);
    console.log(`   Colors: ${uniqueColors.size} dimensions`);
    console.log(`   Sizes: ${uniqueSizes.size} dimensions`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('✅ Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
