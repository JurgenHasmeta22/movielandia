-- CreateTable
CREATE TABLE "Upvote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieReviewId" INTEGER,
    "movieReviewId" INTEGER,
    CONSTRAINT "Upvote_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Upvote_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Downvote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "serieReviewId" INTEGER,
    "movieReviewId" INTEGER,
    CONSTRAINT "Downvote_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Downvote_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Downvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
