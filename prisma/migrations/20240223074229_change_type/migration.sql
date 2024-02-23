/*
  Warnings:

  - You are about to alter the column `size12` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `district` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `ea` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(4)`.
  - You are about to alter the column `vil` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `tam` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `Int` to `NVarChar(2)`.
  - You are about to alter the column `amp` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `econ_fm` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `cwt` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `reg` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `Int` to `SmallInt`.
  - You are about to alter the column `AMP` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `TAM` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `EA` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(4)`.
  - You are about to alter the column `VIL` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `SIZE_R` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `SIZE_L` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.
  - You are about to alter the column `NO` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(4)`.
  - You are about to alter the column `ENU` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `NVarChar(2)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Control] ALTER COLUMN [size12] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [district] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [ea] NVARCHAR(4) NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [vil] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [tam] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [amp] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [econ_fm] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [cwt] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [reg] SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Report] ALTER COLUMN [AMP] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [TAM] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [EA] NVARCHAR(4) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [VIL] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SIZE_R] NVARCHAR(2) NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SIZE_L] NVARCHAR(2) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [NO] NVARCHAR(4) NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [ENU] NVARCHAR(2) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
