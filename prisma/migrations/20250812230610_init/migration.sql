-- CreateTable
CREATE TABLE "public"."Products" (
    "id" TEXT NOT NULL,
    "ItemNumber" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Dept" TEXT NOT NULL,
    "Class" TEXT NOT NULL,
    "RetailPriceMin" TEXT NOT NULL,
    "RetailPriceMax" TEXT NOT NULL,
    "WholesalePriceMin" TEXT NOT NULL,
    "WholesalePriceMax" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Variants" (
    "id" TEXT NOT NULL,
    "ItemNumber" TEXT NOT NULL,
    "SkuId" TEXT NOT NULL,
    "Color" TEXT NOT NULL,
    "Size" TEXT NOT NULL,
    "RetailPrice" DECIMAL(10,2) NOT NULL,
    "WholesalePrice" DECIMAL(10,2) NOT NULL,
    "OnHandQty" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ColorDimensions" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorDimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SizeDimensions" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeDimensions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_ItemNumber_key" ON "public"."Products"("ItemNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Variants_SkuId_key" ON "public"."Variants"("SkuId");

-- CreateIndex
CREATE UNIQUE INDEX "ColorDimensions_Name_key" ON "public"."ColorDimensions"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "SizeDimensions_Name_key" ON "public"."SizeDimensions"("Name");

-- AddForeignKey
ALTER TABLE "public"."Variants" ADD CONSTRAINT "Variants_ItemNumber_fkey" FOREIGN KEY ("ItemNumber") REFERENCES "public"."Products"("ItemNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
