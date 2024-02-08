/*
  Warnings:

  - You are about to alter the column `no` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4)` to `Int`.
  - You are about to alter the column `size12` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `ea` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4)` to `SmallInt`.
  - You are about to alter the column `vil` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `tam` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `Int`.
  - You are about to alter the column `amp` on the `Control` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `AMP` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `TAM` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `EA` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4)` to `SmallInt`.
  - You are about to alter the column `VIL` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `SIZE_R` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `SIZE_L` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `NO` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4)` to `SmallInt`.
  - You are about to alter the column `ENU` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `LG` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `M1` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `M2` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `M3` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `ITR` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI11` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI22` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI33` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI44` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI55` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI66` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `SI77` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `F1` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `F2` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `F3` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `F4` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `F5` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `CIN` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `CDE` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `FAC` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(2)` to `SmallInt`.
  - You are about to alter the column `PIN` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.
  - You are about to alter the column `PDE` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(3)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Control] DROP CONSTRAINT [Control_es_id_key];

-- AlterTable
ALTER TABLE [dbo].[Control] ALTER COLUMN [no] INT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [size12] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [ea] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [vil] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [tam] INT NOT NULL;
ALTER TABLE [dbo].[Control] ALTER COLUMN [amp] SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Report] ALTER COLUMN [AMP] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [TAM] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [EA] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [VIL] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SIZE_R] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SIZE_L] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [NO] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [ENU] SMALLINT NOT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [LG] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [M1] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [M2] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [M3] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [ITR] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI11] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI22] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI33] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI44] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI55] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI66] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [SI77] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [F1] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [F2] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [F3] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [F4] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [F5] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [CIN] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [CDE] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [FAC] SMALLINT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [PIN] INT NULL;
ALTER TABLE [dbo].[Report] ALTER COLUMN [PDE] INT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
