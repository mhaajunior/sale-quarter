/*
  Warnings:

  - Made the column `STO` on table `TempTabulation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `TR` on table `TempTabulation` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TempTabulation] ALTER COLUMN [STO] INT NOT NULL;
ALTER TABLE [dbo].[TempTabulation] ALTER COLUMN [TR] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
