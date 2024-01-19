/*
  Warnings:

  - A unique constraint covering the columns `[es_id,yr]` on the table `Control` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yr` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "yr" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Control_es_id_yr_key" ON "Control"("es_id", "yr");
