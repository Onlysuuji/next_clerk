/*
  Warnings:

  - You are about to drop the column `english` on the `Word` table. All the data in the column will be lost.
  - Added the required column `question` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "english",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'english',
ADD COLUMN     "question" TEXT NOT NULL;
