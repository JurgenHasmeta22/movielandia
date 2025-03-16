/*
  Warnings:

  - You are about to drop the column `type` on the `Playlist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Playlist_type_idx";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "type";

-- DropEnum
DROP TYPE "PlaylistType";
