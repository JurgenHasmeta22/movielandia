/*
  Warnings:

  - You are about to drop the `Downvote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Upvote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Downvote";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Upvote";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UpvoteMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieReviewId" INTEGER,
    "serieReviewId" INTEGER,
    CONSTRAINT "UpvoteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovie_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteMovie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UpvoteSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieReviewId" INTEGER,
    CONSTRAINT "UpvoteSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpvoteSerie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "movieReviewId" INTEGER,
    "serieReviewId" INTEGER,
    CONSTRAINT "DownvoteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovie_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteMovie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DownvoteSerie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieReviewId" INTEGER,
    CONSTRAINT "DownvoteSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DownvoteSerie_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
