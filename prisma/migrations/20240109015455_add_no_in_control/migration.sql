/*
  Warnings:

  - The primary key for the `Control` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Control` table. All the data in the column will be lost.
  - Added the required column `no` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Control" DROP CONSTRAINT "Control_pkey",
DROP COLUMN "id",
ADD COLUMN     "no" TEXT NOT NULL;
