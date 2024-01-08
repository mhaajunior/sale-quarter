-- AlterTable
ALTER TABLE "ReportStatus" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ReportStatus_pkey" PRIMARY KEY ("id");
