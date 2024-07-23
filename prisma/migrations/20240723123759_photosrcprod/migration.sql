/*
  Warnings:

  - You are about to drop the column `videoSrc` on the `Episode` table. All the data in the column will be lost.
  - Made the column `seasonId` on table `Episode` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "seasonId" INTEGER NOT NULL,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("description", "id", "photoSrc", "seasonId", "title") SELECT "description", "id", "photoSrc", "seasonId", "title" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "trailerSrc" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "releaseYear" INTEGER NOT NULL DEFAULT 2023,
    "description" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Movie" ("description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc") SELECT "description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER NOT NULL DEFAULT 2020,
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "serieId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Season_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("id", "photoSrc", "ratingImdb", "releaseYear", "serieId", "title") SELECT "id", "photoSrc", "ratingImdb", "releaseYear", "serieId", "title" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
CREATE TABLE "new_Serie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "trailerSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER NOT NULL DEFAULT 2020,
    "ratingImdb" REAL NOT NULL DEFAULT 5.0
);
INSERT INTO "new_Serie" ("description", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc") SELECT "description", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc" FROM "Serie";
DROP TABLE "Serie";
ALTER TABLE "new_Serie" RENAME TO "Serie";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
