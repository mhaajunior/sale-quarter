/*
  Warnings:

  - Added the required column `province_name` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportStatus" ADD COLUMN     "province_name" TEXT NOT NULL,
ADD COLUMN     "region" INTEGER NOT NULL;
