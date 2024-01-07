/*
  Warnings:

  - The `regis_cid` column on the `Control` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `regis_no` column on the `Control` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[es_id]` on the table `Control` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Control" DROP COLUMN "regis_cid",
ADD COLUMN     "regis_cid" INTEGER,
DROP COLUMN "regis_no",
ADD COLUMN     "regis_no" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Control_es_id_key" ON "Control"("es_id");
