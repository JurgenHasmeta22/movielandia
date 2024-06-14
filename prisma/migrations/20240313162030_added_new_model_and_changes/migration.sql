-- CreateTable
CREATE TABLE "Season" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER NOT NULL DEFAULT 2020,
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "Season_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "videoSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "serieId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Episode_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Episode" ("description", "id", "photoSrc", "serieId", "title", "videoSrc") SELECT "description", "id", "photoSrc", "serieId", "title", "videoSrc" FROM "Episode";
DROP TABLE "Episode";
ALTER TABLE "new_Episode" RENAME TO "Episode";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
