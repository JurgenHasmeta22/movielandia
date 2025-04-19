/*
  Warnings:

  - You are about to drop the column `editCount` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditAt` on the `ForumPost` table. All the data in the column will be lost.
  - You are about to drop the column `editCount` on the `ForumReply` table. All the data in the column will be lost.
  - You are about to drop the column `lastEditAt` on the `ForumReply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ForumPost" DROP COLUMN "editCount",
DROP COLUMN "lastEditAt";

-- AlterTable
ALTER TABLE "ForumReply" DROP COLUMN "editCount",
DROP COLUMN "lastEditAt";
