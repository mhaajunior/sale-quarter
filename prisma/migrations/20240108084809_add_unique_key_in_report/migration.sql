/*
  Warnings:

  - A unique constraint covering the columns `[ID,YR,QTR]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_ID_YR_QTR_key" ON "Report"("ID", "YR", "QTR");
