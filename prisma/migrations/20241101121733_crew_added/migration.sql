/*
  Warnings:

  - You are about to drop the column `role` on the `Actor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actor" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "debut" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewReview" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "CrewReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteCrewReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "crewReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteCrewReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteCrewReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "crewReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteCrewReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMovie" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "CrewMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewSerie" (
    "id" SERIAL NOT NULL,
    "serieId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "CrewSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCrewRating" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "UserCrewRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCrewFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "UserCrewFavorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CrewReview" ADD CONSTRAINT "CrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewReview" ADD CONSTRAINT "CrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteCrewReview" ADD CONSTRAINT "UpvoteCrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteCrewReview" ADD CONSTRAINT "UpvoteCrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteCrewReview" ADD CONSTRAINT "UpvoteCrewReview_crewReviewId_fkey" FOREIGN KEY ("crewReviewId") REFERENCES "CrewReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteCrewReview" ADD CONSTRAINT "DownvoteCrewReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteCrewReview" ADD CONSTRAINT "DownvoteCrewReview_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteCrewReview" ADD CONSTRAINT "DownvoteCrewReview_crewReviewId_fkey" FOREIGN KEY ("crewReviewId") REFERENCES "CrewReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovie" ADD CONSTRAINT "CrewMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMovie" ADD CONSTRAINT "CrewMovie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewSerie" ADD CONSTRAINT "CrewSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewSerie" ADD CONSTRAINT "CrewSerie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrewRating" ADD CONSTRAINT "UserCrewRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrewRating" ADD CONSTRAINT "UserCrewRating_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrewFavorite" ADD CONSTRAINT "UserCrewFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCrewFavorite" ADD CONSTRAINT "UserCrewFavorite_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;
