#!/usr/bin/env tsx
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding users and sample orders...");

  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@century360.com" },
      update: {},
      create: {
        email: "admin@century360.com",
        firstName: "John",
        lastName: "Doe",
        role: "ADMIN",
        isActive: true,
        emailVerified: true,
        profile: {
          create: {
            phone: "+1-555-0123",
            company: "Century 360",
            jobTitle: "System Administrator",
            streetAddress: "123 Main St",
            city: "Oklahoma City",
            state: "OK",
            postalCode: "73102",
            country: "US",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Create sample customer
    const customer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        email: "customer@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "CUSTOMER",
        isActive: true,
        emailVerified: true,
        profile: {
          create: {
            phone: "+1-555-0456",
            company: "Martial Arts Studio",
            streetAddress: "456 Oak Avenue",
            city: "Dallas",
            state: "TX",
            postalCode: "75201",
            country: "US",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Get some products for sample orders
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        variants: {
          take: 1,
        },
      },
    });

    // Create sample order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: customer.id,
        customerEmail: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`,
        status: "CONFIRMED",
        subtotal: 125.97,
        taxAmount: 10.08,
        shippingAmount: 9.95,
        discountAmount: 0,
        totalAmount: 146.0,
        shippingName: `${customer.firstName} ${customer.lastName}`,
        shippingStreet: customer.profile?.streetAddress || "456 Oak Avenue",
        shippingCity: customer.profile?.city || "Dallas",
        shippingState: customer.profile?.state || "TX",
        shippingPostalCode: customer.profile?.postalCode || "75201",
        shippingCountry: customer.profile?.country || "US",
        billingName: `${customer.firstName} ${customer.lastName}`,
        billingStreet: customer.profile?.streetAddress || "456 Oak Avenue",
        billingCity: customer.profile?.city || "Dallas",
        billingState: customer.profile?.state || "TX",
        billingPostalCode: customer.profile?.postalCode || "75201",
        billingCountry: customer.profile?.country || "US",
        items: {
          create: products.slice(0, 3).map((product, index) => ({
            productId: product.id,
            variantId: product.variants[0]?.id,
            itemNumber: product.ItemNumber,
            productName: product.Name,
            variantSku: product.variants[0]?.SkuId,
            color: product.variants[0]?.Color,
            size: product.variants[0]?.Size,
            quantity: index + 1,
            unitPrice: parseFloat(product.RetailPriceMin),
            totalPrice: parseFloat(product.RetailPriceMin) * (index + 1),
          })),
        },
        payments: {
          create: {
            amount: 146.0,
            currency: "USD",
            status: "COMPLETED",
            method: "CREDIT_CARD",
            processorId: `pi_${Date.now()}`,
            processedAt: new Date(),
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    console.log("✅ Users and sample data created:");
    console.log(`👤 Admin: ${adminUser.email}`);
    console.log(`👤 Customer: ${customer.email}`);
    console.log(`📦 Sample Order: ${order.orderNumber}`);

    // Update counts
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.userProfile.count(),
      prisma.order.count(),
      prisma.orderItem.count(),
      prisma.payment.count(),
    ]);

    console.log("\n📊 Database counts:");
    console.log(`Users: ${counts[0]}`);
    console.log(`User Profiles: ${counts[1]}`);
    console.log(`Orders: ${counts[2]}`);
    console.log(`Order Items: ${counts[3]}`);
    console.log(`Payments: ${counts[4]}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
