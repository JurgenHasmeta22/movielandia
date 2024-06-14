-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Serie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT '',
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "trailerSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "releaseYear" INTEGER NOT NULL DEFAULT 2020,
    "ratingImdb" REAL NOT NULL DEFAULT 5.0
);
INSERT INTO "new_Serie" ("id", "photoSrc", "ratingImdb", "releaseYear", "title") SELECT "id", "photoSrc", "ratingImdb", "releaseYear", "title" FROM "Serie";
DROP TABLE "Serie";
ALTER TABLE "new_Serie" RENAME TO "Serie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
