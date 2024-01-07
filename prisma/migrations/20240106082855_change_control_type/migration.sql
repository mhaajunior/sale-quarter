/*
  Warnings:

  - Changed the type of `es_id` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tsic_code` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `district` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `econ_fm` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cwt` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reg` on the `Control` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Control" DROP COLUMN "es_id",
ADD COLUMN     "es_id" INTEGER NOT NULL,
DROP COLUMN "tsic_code",
ADD COLUMN     "tsic_code" INTEGER NOT NULL,
DROP COLUMN "district",
ADD COLUMN     "district" INTEGER NOT NULL,
DROP COLUMN "econ_fm",
ADD COLUMN     "econ_fm" INTEGER NOT NULL,
DROP COLUMN "cwt",
ADD COLUMN     "cwt" INTEGER NOT NULL,
DROP COLUMN "reg",
ADD COLUMN     "reg" INTEGER NOT NULL;
