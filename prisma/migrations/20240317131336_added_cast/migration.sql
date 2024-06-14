/*
  Warnings:

  - You are about to drop the column `videoSrc` on the `Movie` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CastMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "CastMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CastMovie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CastSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    CONSTRAINT "CastSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CastSerie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "trailerSrc" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "releaseYear" INTEGER NOT NULL DEFAULT 2023,
    "description" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Movie" ("description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc") SELECT "description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
