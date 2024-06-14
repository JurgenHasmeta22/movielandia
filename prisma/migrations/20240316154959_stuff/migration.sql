-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "videoSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "seasonId" INTEGER,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("description", "id", "photoSrc", "seasonId", "title", "videoSrc") SELECT "description", "id", "photoSrc", "seasonId", "title", "videoSrc" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
CREATE TABLE "new_Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER NOT NULL DEFAULT 2020,
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "serieId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Season_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Season" ("id", "photoSrc", "ratingImdb", "releaseYear", "serieId", "title") SELECT "id", "photoSrc", "ratingImdb", "releaseYear", "serieId", "title" FROM "Season";
DROP TABLE "Season";
ALTER TABLE "new_Season" RENAME TO "Season";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
