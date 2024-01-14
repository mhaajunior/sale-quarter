/*
  Warnings:

  - Added the required column `province` to the `ReportStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportStatus" ADD COLUMN     "province" INTEGER NOT NULL;
