/*
  Warnings:

  - You are about to drop the `TOEICRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TOEICRegistration" DROP CONSTRAINT "TOEICRegistration_userId_fkey";

-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_userId_fkey";

-- DropTable
DROP TABLE "TOEICRegistration";

-- DropTable
DROP TABLE "User";
