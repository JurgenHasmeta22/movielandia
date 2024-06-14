-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MovieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MovieReview" ("content", "createdAt", "id", "movieId", "userId") SELECT "content", "createdAt", "id", "movieId", "userId" FROM "MovieReview";
DROP TABLE "MovieReview";
ALTER TABLE "new_MovieReview" RENAME TO "MovieReview";
CREATE TABLE "new_SerieReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    CONSTRAINT "SerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SerieReview" ("content", "createdAt", "id", "serieId", "userId") SELECT "content", "createdAt", "id", "serieId", "userId" FROM "SerieReview";
DROP TABLE "SerieReview";
ALTER TABLE "new_SerieReview" RENAME TO "SerieReview";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
