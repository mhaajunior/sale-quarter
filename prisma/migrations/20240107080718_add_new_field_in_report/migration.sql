/*
  Warnings:

  - Added the required column `LG1_temp` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "LG1_temp" VARCHAR(1) NOT NULL;
