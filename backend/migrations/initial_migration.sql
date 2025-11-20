-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_repositoryname]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

-- Create Account Table (Basic structure for multi-tenancy)
CREATE TABLE [dbo].[account] (
    [idAccount] INT IDENTITY(1,1) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [pkAccount] PRIMARY KEY CLUSTERED ([idAccount])
);
GO

-- Seed default account for single-user mode
SET IDENTITY_INSERT [dbo].[account] ON;
INSERT INTO [dbo].[account] ([idAccount], [name]) VALUES (1, 'Default Account');
SET IDENTITY_INSERT [dbo].[account] OFF;
GO

-- Create Purchase Table
CREATE TABLE [dbo].[purchase] (
    [idPurchase] INT IDENTITY(1,1) NOT NULL,
    [idAccount] INT NOT NULL,
    [uuid] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [productName] NVARCHAR(100) NOT NULL,
    [quantity] DECIMAL(10,3) NOT NULL,
    [unitMeasure] NVARCHAR(10) NOT NULL,
    [unitPrice] NUMERIC(18,2) NOT NULL,
    [totalPrice] NUMERIC(18,2) NOT NULL,
    [purchaseDate] DATE NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [pkPurchase] PRIMARY KEY CLUSTERED ([idPurchase]),
    CONSTRAINT [fkPurchase_Account] FOREIGN KEY ([idAccount]) REFERENCES [dbo].[account]([idAccount]),
    CONSTRAINT [chkPurchase_UnitMeasure] CHECK ([unitMeasure] IN ('un', 'kg', 'g', 'L', 'mL'))
);
GO

-- =====================================================
-- INDEXES
-- =====================================================

CREATE NONCLUSTERED INDEX [ixPurchase_Account_Date] 
ON [dbo].[purchase]([idAccount], [purchaseDate] DESC);
GO

CREATE UNIQUE NONCLUSTERED INDEX [ixPurchase_Uuid]
ON [dbo].[purchase]([idAccount], [uuid]);
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseCreate]
    @idAccount INT,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @unitMeasure NVARCHAR(10),
    @unitPrice NUMERIC(18,2),
    @totalPrice NUMERIC(18,2),
    @purchaseDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @newId TABLE([uuid] UNIQUEIDENTIFIER);

    INSERT INTO [dbo].[purchase] (
        [idAccount], [productName], [quantity], [unitMeasure], 
        [unitPrice], [totalPrice], [purchaseDate]
    )
    OUTPUT INSERTED.[uuid] INTO @newId
    VALUES (
        @idAccount, @productName, @quantity, @unitMeasure, 
        @unitPrice, @totalPrice, @purchaseDate
    );

    SELECT [uuid] AS [id] FROM @newId;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseUpdate]
    @idAccount INT,
    @uuid UNIQUEIDENTIFIER,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @unitMeasure NVARCHAR(10),
    @unitPrice NUMERIC(18,2),
    @totalPrice NUMERIC(18,2),
    @purchaseDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchase] WHERE [uuid] = @uuid AND [idAccount] = @idAccount)
    BEGIN
        ;THROW 51000, 'purchaseNotFound', 1;
    END

    UPDATE [dbo].[purchase]
    SET 
        [productName] = @productName,
        [quantity] = @quantity,
        [unitMeasure] = @unitMeasure,
        [unitPrice] = @unitPrice,
        [totalPrice] = @totalPrice,
        [purchaseDate] = @purchaseDate,
        [updatedAt] = GETUTCDATE()
    WHERE [uuid] = @uuid AND [idAccount] = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseDelete]
    @idAccount INT,
    @uuid UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchase] WHERE [uuid] = @uuid AND [idAccount] = @idAccount)
    BEGIN
        ;THROW 51000, 'purchaseNotFound', 1;
    END

    -- Hard delete as per specification BR-008
    DELETE FROM [dbo].[purchase]
    WHERE [uuid] = @uuid AND [idAccount] = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseList]
    @idAccount INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Result Set 1: List of purchases
    SELECT 
        [uuid] AS [id],
        [productName],
        [quantity],
        [unitMeasure],
        [unitPrice],
        [totalPrice],
        [purchaseDate]
    FROM [dbo].[purchase]
    WHERE [idAccount] = @idAccount
    ORDER BY [purchaseDate] DESC;

    -- Result Set 2: Total spent in current month
    SELECT 
        ISNULL(SUM([totalPrice]), 0) AS [totalSpent]
    FROM [dbo].[purchase]
    WHERE [idAccount] = @idAccount
      AND MONTH([purchaseDate]) = MONTH(GETUTCDATE())
      AND YEAR([purchaseDate]) = YEAR(GETUTCDATE());
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseGet]
    @idAccount INT,
    @uuid UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        [uuid] AS [id],
        [productName],
        [quantity],
        [unitMeasure],
        [unitPrice],
        [totalPrice],
        [purchaseDate]
    FROM [dbo].[purchase]
    WHERE [idAccount] = @idAccount AND [uuid] = @uuid;
END;
GO