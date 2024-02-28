/*
  Warnings:

  - You are about to drop the column `district` on the `Control` table. All the data in the column will be lost.
  - Added the required column `mun` to the `Control` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_title` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Control] DROP COLUMN [district];
ALTER TABLE [dbo].[Control] ADD [mun] SMALLINT NOT NULL,
[name_title] NVARCHAR(10) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
