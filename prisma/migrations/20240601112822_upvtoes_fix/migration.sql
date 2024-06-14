/*
  Warnings:

  - You are about to drop the column `serieReviewId` on the `UpvoteMovie` table. All the data in the column will be lost.
  - You are about to drop the column `serieReviewId` on the `DownvoteMovie` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `UpvoteMovie` table without a default value. This is not possible if the table is not empty.
  - Made the column `movieReviewId` on table `UpvoteMovie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `serieId` to the `DownvoteSerie` table without a default value. This is not possible if the table is not empty.
  - Made the column `serieReviewId` on table `DownvoteSerie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `movieId` to the `DownvoteMovie` table without a default value. This is not possible if the table is not empty.
  - Made the column `movieReviewId` on table `DownvoteMovie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `serieId` to the `UpvoteSerie` table without a default value. This is not possible if the table is not empty.
  - Made the column `serieReviewId` on table `UpvoteSerie` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UpvoteMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovie_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UpvoteMovie" ("id", "movieReviewId", "userId") SELECT "id", "movieReviewId", "userId" FROM "UpvoteMovie";
DROP TABLE "UpvoteMovie";
ALTER TABLE "new_UpvoteMovie" RENAME TO "UpvoteMovie";
CREATE TABLE "new_DownvoteSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSerie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DownvoteSerie" ("id", "serieReviewId", "userId") SELECT "id", "serieReviewId", "userId" FROM "DownvoteSerie";
DROP TABLE "DownvoteSerie";
ALTER TABLE "new_DownvoteSerie" RENAME TO "DownvoteSerie";
CREATE TABLE "new_DownvoteMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,
    CONSTRAINT "DownvoteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovie_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DownvoteMovie" ("id", "movieReviewId", "userId") SELECT "id", "movieReviewId", "userId" FROM "DownvoteMovie";
DROP TABLE "DownvoteMovie";
ALTER TABLE "new_DownvoteMovie" RENAME TO "DownvoteMovie";
CREATE TABLE "new_UpvoteSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,
    CONSTRAINT "UpvoteSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSerie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UpvoteSerie" ("id", "serieReviewId", "userId") SELECT "id", "serieReviewId", "userId" FROM "UpvoteSerie";
DROP TABLE "UpvoteSerie";
ALTER TABLE "new_UpvoteSerie" RENAME TO "UpvoteSerie";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
