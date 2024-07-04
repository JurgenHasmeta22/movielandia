-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
