/*
  Warnings:

  - You are about to drop the column `status` on the `Message` table. All the data in the column will be lost.
  - Made the column `receiverId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "status",
ALTER COLUMN "receiverId" SET NOT NULL;
