/*
  Warnings:

  - The primary key for the `ReportStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `no` on the `ReportStatus` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DROP INDEX [ReportStatus_ID_idx] ON [dbo].[ReportStatus];
ALTER TABLE [dbo].[ReportStatus] DROP CONSTRAINT [ReportStatus_ID_year_key];
DROP INDEX [ReportStatus_province_idx] ON [dbo].[ReportStatus];
DROP INDEX [ReportStatus_year_idx] ON [dbo].[ReportStatus];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'ReportStatus'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_ReportStatus] (
    [ID] NVARCHAR(15) NOT NULL,
    [year] SMALLINT NOT NULL,
    [no] SMALLINT NOT NULL,
    [province] SMALLINT NOT NULL,
    [province_name] NVARCHAR(30) NOT NULL,
    [region] SMALLINT NOT NULL,
    [canCreateQtr1] BIT NOT NULL,
    [canCreateQtr2] BIT NOT NULL,
    [canCreateQtr3] BIT NOT NULL,
    [canCreateQtr4] BIT NOT NULL,
    [isSendQtr1] BIT NOT NULL,
    [isSendQtr2] BIT NOT NULL,
    [isSendQtr3] BIT NOT NULL,
    [isSendQtr4] BIT NOT NULL,
    [isApproveQtr1] BIT NOT NULL,
    [isApproveQtr2] BIT NOT NULL,
    [isApproveQtr3] BIT NOT NULL,
    [isApproveQtr4] BIT NOT NULL,
    CONSTRAINT [ReportStatus_ID_year_key] UNIQUE NONCLUSTERED ([ID],[year])
);
IF EXISTS(SELECT * FROM [dbo].[ReportStatus])
    EXEC('INSERT INTO [dbo].[_prisma_new_ReportStatus] ([ID],[canCreateQtr1],[canCreateQtr2],[canCreateQtr3],[canCreateQtr4],[isApproveQtr1],[isApproveQtr2],[isApproveQtr3],[isApproveQtr4],[isSendQtr1],[isSendQtr2],[isSendQtr3],[isSendQtr4],[no],[province],[province_name],[region],[year]) SELECT [ID],[canCreateQtr1],[canCreateQtr2],[canCreateQtr3],[canCreateQtr4],[isApproveQtr1],[isApproveQtr2],[isApproveQtr3],[isApproveQtr4],[isSendQtr1],[isSendQtr2],[isSendQtr3],[isSendQtr4],[no],[province],[province_name],[region],[year] FROM [dbo].[ReportStatus] WITH (holdlock tablockx)');
DROP TABLE [dbo].[ReportStatus];
EXEC SP_RENAME N'dbo._prisma_new_ReportStatus', N'ReportStatus';
CREATE NONCLUSTERED INDEX [ReportStatus_ID_idx] ON [dbo].[ReportStatus]([ID]);
CREATE NONCLUSTERED INDEX [ReportStatus_year_idx] ON [dbo].[ReportStatus]([year]);
CREATE NONCLUSTERED INDEX [ReportStatus_province_idx] ON [dbo].[ReportStatus]([province]);
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
