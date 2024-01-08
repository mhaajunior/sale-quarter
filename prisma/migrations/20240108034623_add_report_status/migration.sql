-- CreateTable
CREATE TABLE "ReportStatus" (
    "ID" BIGINT NOT NULL,
    "year" INTEGER NOT NULL,
    "canCreateQtr1" BOOLEAN NOT NULL,
    "canCreateQtr2" BOOLEAN NOT NULL,
    "canCreateQtr3" BOOLEAN NOT NULL,
    "canCreateQtr4" BOOLEAN NOT NULL,
    "isSendQtr1" BOOLEAN NOT NULL,
    "isSendQtr2" BOOLEAN NOT NULL,
    "isSendQtr3" BOOLEAN NOT NULL,
    "isSendQtr4" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportStatus_ID_year_key" ON "ReportStatus"("ID", "year");
