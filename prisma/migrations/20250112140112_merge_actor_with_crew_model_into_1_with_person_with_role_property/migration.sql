/*
  Warnings:

  - You are about to drop the `Actor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ActorReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CastMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CastSerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Crew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrewMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrewReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrewSerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteActorReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteCrewReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpvoteActorReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpvoteCrewReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActorFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserActorRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCrewFavorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCrewRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActorReview" DROP CONSTRAINT "ActorReview_actorId_fkey";

-- DropForeignKey
ALTER TABLE "ActorReview" DROP CONSTRAINT "ActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "CastMovie" DROP CONSTRAINT "CastMovie_actorId_fkey";

-- DropForeignKey
ALTER TABLE "CastMovie" DROP CONSTRAINT "CastMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "CastSerie" DROP CONSTRAINT "CastSerie_actorId_fkey";

-- DropForeignKey
ALTER TABLE "CastSerie" DROP CONSTRAINT "CastSerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "CrewMovie" DROP CONSTRAINT "CrewMovie_crewId_fkey";

-- DropForeignKey
ALTER TABLE "CrewMovie" DROP CONSTRAINT "CrewMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "CrewReview" DROP CONSTRAINT "CrewReview_crewId_fkey";

-- DropForeignKey
ALTER TABLE "CrewReview" DROP CONSTRAINT "CrewReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "CrewSerie" DROP CONSTRAINT "CrewSerie_crewId_fkey";

-- DropForeignKey
ALTER TABLE "CrewSerie" DROP CONSTRAINT "CrewSerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteActorReview" DROP CONSTRAINT "DownvoteActorReview_actorId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteActorReview" DROP CONSTRAINT "DownvoteActorReview_actorReviewId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteActorReview" DROP CONSTRAINT "DownvoteActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteCrewReview" DROP CONSTRAINT "DownvoteCrewReview_crewId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteCrewReview" DROP CONSTRAINT "DownvoteCrewReview_crewReviewId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteCrewReview" DROP CONSTRAINT "DownvoteCrewReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteActorReview" DROP CONSTRAINT "UpvoteActorReview_actorId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteActorReview" DROP CONSTRAINT "UpvoteActorReview_actorReviewId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteActorReview" DROP CONSTRAINT "UpvoteActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteCrewReview" DROP CONSTRAINT "UpvoteCrewReview_crewId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteCrewReview" DROP CONSTRAINT "UpvoteCrewReview_crewReviewId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteCrewReview" DROP CONSTRAINT "UpvoteCrewReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorFavorite" DROP CONSTRAINT "UserActorFavorite_actorId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorFavorite" DROP CONSTRAINT "UserActorFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorRating" DROP CONSTRAINT "UserActorRating_actorId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorRating" DROP CONSTRAINT "UserActorRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCrewFavorite" DROP CONSTRAINT "UserCrewFavorite_crewId_fkey";

-- DropForeignKey
ALTER TABLE "UserCrewFavorite" DROP CONSTRAINT "UserCrewFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCrewRating" DROP CONSTRAINT "UserCrewRating_crewId_fkey";

-- DropForeignKey
ALTER TABLE "UserCrewRating" DROP CONSTRAINT "UserCrewRating_userId_fkey";

-- DropTable
DROP TABLE "Actor";

-- DropTable
DROP TABLE "ActorReview";

-- DropTable
DROP TABLE "CastMovie";

-- DropTable
DROP TABLE "CastSerie";

-- DropTable
DROP TABLE "Crew";

-- DropTable
DROP TABLE "CrewMovie";

-- DropTable
DROP TABLE "CrewReview";

-- DropTable
DROP TABLE "CrewSerie";

-- DropTable
DROP TABLE "DownvoteActorReview";

-- DropTable
DROP TABLE "DownvoteCrewReview";

-- DropTable
DROP TABLE "UpvoteActorReview";

-- DropTable
DROP TABLE "UpvoteCrewReview";

-- DropTable
DROP TABLE "UserActorFavorite";

-- DropTable
DROP TABLE "UserActorRating";

-- DropTable
DROP TABLE "UserCrewFavorite";

-- DropTable
DROP TABLE "UserCrewRating";

-- CreateTable
CREATE TABLE "PersonMovie" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "PersonMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "photoSrc" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "photoSrcProd" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "debut" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonReview" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "PersonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvotePersonReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "personReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvotePersonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvotePersonReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "personReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvotePersonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonSerie" (
    "id" SERIAL NOT NULL,
    "serieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "PersonSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPersonRating" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "UserPersonRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPersonFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "UserPersonFavorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonMovie" ADD CONSTRAINT "PersonMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonMovie" ADD CONSTRAINT "PersonMovie_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonReview" ADD CONSTRAINT "PersonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonReview" ADD CONSTRAINT "PersonReview_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotePersonReview" ADD CONSTRAINT "UpvotePersonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotePersonReview" ADD CONSTRAINT "UpvotePersonReview_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvotePersonReview" ADD CONSTRAINT "UpvotePersonReview_personReviewId_fkey" FOREIGN KEY ("personReviewId") REFERENCES "PersonReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvotePersonReview" ADD CONSTRAINT "DownvotePersonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvotePersonReview" ADD CONSTRAINT "DownvotePersonReview_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvotePersonReview" ADD CONSTRAINT "DownvotePersonReview_personReviewId_fkey" FOREIGN KEY ("personReviewId") REFERENCES "PersonReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSerie" ADD CONSTRAINT "PersonSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSerie" ADD CONSTRAINT "PersonSerie_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonRating" ADD CONSTRAINT "UserPersonRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonRating" ADD CONSTRAINT "UserPersonRating_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonFavorite" ADD CONSTRAINT "UserPersonFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPersonFavorite" ADD CONSTRAINT "UserPersonFavorite_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
