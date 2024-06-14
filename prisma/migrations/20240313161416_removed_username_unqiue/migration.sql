-- DropIndex
DROP INDEX "User_userName_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "videoSrc" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "trailerSrc" TEXT NOT NULL DEFAULT '',
    "duration" TEXT NOT NULL DEFAULT '',
    "ratingImdb" REAL NOT NULL DEFAULT 5.0,
    "releaseYear" INTEGER NOT NULL DEFAULT 2023,
    "description" TEXT NOT NULL DEFAULT '',
    "views" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Movie" ("description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc", "videoSrc", "views") SELECT "description", "duration", "id", "photoSrc", "ratingImdb", "releaseYear", "title", "trailerSrc", "videoSrc", "views" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
