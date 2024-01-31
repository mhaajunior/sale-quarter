BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Control] (
    [no] NVARCHAR(4) NOT NULL,
    [es_id] BIGINT NOT NULL,
    [tsic_code] INT NOT NULL,
    [size12] NVARCHAR(2) NOT NULL,
    [initial] NVARCHAR(10),
    [firstname] NVARCHAR(60),
    [lastname] NVARCHAR(60),
    [comp_name] NVARCHAR(100),
    [district] INT NOT NULL,
    [ea] NVARCHAR(4) NOT NULL,
    [vil] NVARCHAR(2) NOT NULL,
    [house_no] NVARCHAR(30) NOT NULL,
    [street] NVARCHAR(50),
    [soi] NVARCHAR(30),
    [building] NVARCHAR(60),
    [tam] NVARCHAR(2) NOT NULL,
    [tam_name] NVARCHAR(30) NOT NULL,
    [amp] NVARCHAR(2) NOT NULL,
    [amp_name] NVARCHAR(30) NOT NULL,
    [tel_no] NVARCHAR(20),
    [e_mail] NVARCHAR(30),
    [econ_fm] INT NOT NULL,
    [regis_cid] NVARCHAR(1000),
    [regis_no] NVARCHAR(1000),
    [cwt] INT NOT NULL,
    [cwt_name] NVARCHAR(30) NOT NULL,
    [reg] INT NOT NULL,
    [yr] INT NOT NULL,
    CONSTRAINT [Control_es_id_key] UNIQUE NONCLUSTERED ([es_id]),
    CONSTRAINT [Control_es_id_yr_key] UNIQUE NONCLUSTERED ([es_id],[yr])
);

-- CreateTable
CREATE TABLE [dbo].[Report] (
    [uuid] NVARCHAR(1000) NOT NULL,
    [ID] NVARCHAR(15) NOT NULL,
    [REG] SMALLINT NOT NULL,
    [CWT] SMALLINT NOT NULL,
    [AMP] NVARCHAR(2) NOT NULL,
    [TAM] NVARCHAR(2) NOT NULL,
    [MUN] SMALLINT NOT NULL,
    [EA] NVARCHAR(4) NOT NULL,
    [VIL] NVARCHAR(2) NOT NULL,
    [TSIC_R] INT,
    [TSIC_L] INT NOT NULL,
    [SIZE_R] NVARCHAR(2),
    [SIZE_L] NVARCHAR(2) NOT NULL,
    [NO] NVARCHAR(4) NOT NULL,
    [QTR] SMALLINT NOT NULL,
    [YR] SMALLINT NOT NULL,
    [ENU] NVARCHAR(2) NOT NULL,
    [TITLE] NVARCHAR(10) NOT NULL,
    [RANK] NVARCHAR(20) NOT NULL,
    [FIRSTNAME] NVARCHAR(60) NOT NULL,
    [LASTNAME] NVARCHAR(60) NOT NULL,
    [EST_TITLE] NVARCHAR(10) NOT NULL,
    [EST_NAME] NVARCHAR(100) NOT NULL,
    [ADD_NO] NVARCHAR(30) NOT NULL,
    [BUILDING] NVARCHAR(60) NOT NULL,
    [ROOM] NVARCHAR(30) NOT NULL,
    [STREET] NVARCHAR(50) NOT NULL,
    [BLK] NVARCHAR(30) NOT NULL,
    [SOI] NVARCHAR(30) NOT NULL,
    [SUB_DIST] NVARCHAR(30) NOT NULL,
    [DISTRICT] NVARCHAR(30) NOT NULL,
    [PROVINCE] NVARCHAR(30) NOT NULL,
    [POST_CODE] NVARCHAR(5) NOT NULL,
    [TEL_NO] NVARCHAR(20) NOT NULL,
    [E_MAIL] NVARCHAR(30) NOT NULL,
    [WEBSITE] NVARCHAR(30) NOT NULL,
    [SOCIAL] NVARCHAR(30) NOT NULL,
    [ANSWER] SMALLINT NOT NULL,
    [TSIC_CHG] INT,
    [LG] NVARCHAR(2),
    [LG1] NVARCHAR(13),
    [LG1_temp] NVARCHAR(1) NOT NULL,
    [LG2] NVARCHAR(13),
    [LG3] NVARCHAR(13),
    [LG4] NVARCHAR(13),
    [DES_TYPE] NVARCHAR(60),
    [TYPE] INT,
    [M1] NVARCHAR(2),
    [M2] NVARCHAR(2),
    [M3] NVARCHAR(2),
    [R1] INT,
    [R2] INT,
    [R3] INT,
    [TR] INT,
    [SI] INT,
    [ITR] NVARCHAR(3),
    [SI1] SMALLINT,
    [SI2] SMALLINT,
    [SI3] SMALLINT,
    [SI4] SMALLINT,
    [SI5] SMALLINT,
    [SI6] SMALLINT,
    [SI7] SMALLINT,
    [SI8] NVARCHAR(60),
    [SI11] NVARCHAR(3),
    [SI22] NVARCHAR(3),
    [SI33] NVARCHAR(3),
    [SI44] NVARCHAR(3),
    [SI55] NVARCHAR(3),
    [SI66] NVARCHAR(3),
    [SI77] NVARCHAR(3),
    [F1] NVARCHAR(3),
    [F2] NVARCHAR(3),
    [F3] NVARCHAR(3),
    [F4] NVARCHAR(3),
    [F5] NVARCHAR(3),
    [CHG] SMALLINT,
    [CIN] NVARCHAR(3),
    [CDE] NVARCHAR(3),
    [FAC] NVARCHAR(2),
    [FAC_1] NVARCHAR(100),
    [PRVS] SMALLINT,
    [PIN] NVARCHAR(3),
    [PDE] NVARCHAR(3),
    [EMP] INT,
    [STO] NVARCHAR(1000),
    [DAY] SMALLINT,
    [OP1] SMALLINT,
    [OP2] SMALLINT,
    [OP3] SMALLINT,
    [OP4] SMALLINT,
    [OP5] SMALLINT,
    [OP6] SMALLINT,
    [OP7] SMALLINT,
    [OP8] SMALLINT,
    [OP9] SMALLINT,
    [OP10] SMALLINT,
    [OP11] SMALLINT,
    [OP12] SMALLINT,
    [P1] NVARCHAR(7),
    [P2] NVARCHAR(7),
    [P3] NVARCHAR(7),
    [P4] NVARCHAR(7),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Report_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Report_pkey] PRIMARY KEY CLUSTERED ([uuid]),
    CONSTRAINT [Report_ID_YR_QTR_key] UNIQUE NONCLUSTERED ([ID],[YR],[QTR])
);

-- CreateTable
CREATE TABLE [dbo].[ReportStatus] (
    [no] INT NOT NULL IDENTITY(1,1),
    [ID] NVARCHAR(15) NOT NULL,
    [year] SMALLINT NOT NULL,
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
    CONSTRAINT [ReportStatus_pkey] PRIMARY KEY CLUSTERED ([no]),
    CONSTRAINT [ReportStatus_ID_year_key] UNIQUE NONCLUSTERED ([ID],[year])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(30) NOT NULL,
    [password] NVARCHAR(60) NOT NULL,
    [fullname] NVARCHAR(120) NOT NULL,
    [province] SMALLINT NOT NULL,
    [role] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Control_es_id_idx] ON [dbo].[Control]([es_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Report_ID_idx] ON [dbo].[Report]([ID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Report_CWT_idx] ON [dbo].[Report]([CWT]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Report_QTR_idx] ON [dbo].[Report]([QTR]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Report_YR_idx] ON [dbo].[Report]([YR]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ReportStatus_ID_idx] ON [dbo].[ReportStatus]([ID]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ReportStatus_year_idx] ON [dbo].[ReportStatus]([year]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ReportStatus_province_idx] ON [dbo].[ReportStatus]([province]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [User_username_idx] ON [dbo].[User]([username]);

-- AddForeignKey
ALTER TABLE [dbo].[Report] ADD CONSTRAINT [Report_ID_YR_fkey] FOREIGN KEY ([ID], [YR]) REFERENCES [dbo].[ReportStatus]([ID],[year]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
