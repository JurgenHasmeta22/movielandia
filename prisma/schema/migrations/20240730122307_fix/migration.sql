/*
  Warnings:

  - You are about to drop the column `releaseYear` on the `Serie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Serie" DROP COLUMN "releaseYear",
ADD COLUMN     "dateAired" TEXT NOT NULL DEFAULT '01/01/2020';
