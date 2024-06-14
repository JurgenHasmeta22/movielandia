/*
  Warnings:

  - You are about to drop the `Season` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `ratingImdb` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `Episode` table. All the data in the column will be lost.
  - Added the required column `serieId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Season";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "Episode_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("description", "id", "photoSrc", "title") SELECT "description", "id", "photoSrc", "title" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
