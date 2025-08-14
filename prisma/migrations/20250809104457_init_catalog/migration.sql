BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Product_id_df] DEFAULT newsequentialid(),
    [ItemNumber] NVARCHAR(1000) NOT NULL,
    [Name] NVARCHAR(1000) NOT NULL,
    [Dept] NVARCHAR(1000) NOT NULL,
    [Class] NVARCHAR(1000) NOT NULL,
    [RetailPriceMin] DECIMAL(19,4) NOT NULL,
    [RetailPriceMax] DECIMAL(19,4) NOT NULL,
    [WholesalePriceMin] DECIMAL(19,4),
    [WholesalePriceMax] DECIMAL(19,4),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Product_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Product_ItemNumber_key] UNIQUE NONCLUSTERED ([ItemNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Variant] (
    [id] UNIQUEIDENTIFIER NOT NULL CONSTRAINT [Variant_id_df] DEFAULT newsequentialid(),
    [ProductId] UNIQUEIDENTIFIER NOT NULL,
    [SkuId] NVARCHAR(1000) NOT NULL,
    [ItemNumber] NVARCHAR(1000) NOT NULL,
    [Color] NVARCHAR(1000),
    [Size] NVARCHAR(1000),
    [RetailPrice] DECIMAL(19,4) NOT NULL,
    [WholesalePrice] DECIMAL(19,4),
    [OnHandQty] INT NOT NULL CONSTRAINT [Variant_OnHandQty_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Variant_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Variant_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Variant_SkuId_key] UNIQUE NONCLUSTERED ([SkuId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_Name_idx] ON [dbo].[Product]([Name]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_Dept_idx] ON [dbo].[Product]([Dept]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Product_Class_idx] ON [dbo].[Product]([Class]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Variant_ProductId_idx] ON [dbo].[Variant]([ProductId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Variant_ItemNumber_idx] ON [dbo].[Variant]([ItemNumber]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Variant_Color_idx] ON [dbo].[Variant]([Color]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Variant_Size_idx] ON [dbo].[Variant]([Size]);

-- AddForeignKey
ALTER TABLE [dbo].[Variant] ADD CONSTRAINT [Variant_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
