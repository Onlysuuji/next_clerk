/*
  Warnings:

  - You are about to drop the column `level` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "level",
ADD COLUMN     "tag" TEXT NOT NULL DEFAULT 'TOEIC 600-700';
