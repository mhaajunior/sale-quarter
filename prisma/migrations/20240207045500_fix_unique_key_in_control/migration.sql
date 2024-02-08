/*
  Warnings:

  - You are about to drop the column `yr` on the `Control` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[es_id]` on the table `Control` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Control] DROP CONSTRAINT [Control_es_id_yr_key];

-- AlterTable
ALTER TABLE [dbo].[Control] DROP COLUMN [yr];

-- CreateIndex
ALTER TABLE [dbo].[Control] ADD CONSTRAINT [Control_es_id_key] UNIQUE NONCLUSTERED ([es_id]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
