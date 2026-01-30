/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId]` on the table `MovieReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MovieReview_userId_movieId_key" ON "MovieReview"("userId", "movieId");
