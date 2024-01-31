/*
  Warnings:

  - Added the required column `isApproveQtr1` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isApproveQtr2` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isApproveQtr3` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isApproveQtr4` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ReportStatus] ADD [isApproveQtr1] BIT NOT NULL,
[isApproveQtr2] BIT NOT NULL,
[isApproveQtr3] BIT NOT NULL,
[isApproveQtr4] BIT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
