/*
  Warnings:

  - You are about to drop the column `releaseYear` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the `DownvoteMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteSerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpvoteMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpvoteSerie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DownvoteMovie" DROP CONSTRAINT "DownvoteMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteMovie" DROP CONSTRAINT "DownvoteMovie_movieReviewId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteMovie" DROP CONSTRAINT "DownvoteMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteSerie" DROP CONSTRAINT "DownvoteSerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteSerie" DROP CONSTRAINT "DownvoteSerie_serieReviewId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteSerie" DROP CONSTRAINT "DownvoteSerie_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteMovie" DROP CONSTRAINT "UpvoteMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteMovie" DROP CONSTRAINT "UpvoteMovie_movieReviewId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteMovie" DROP CONSTRAINT "UpvoteMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteSerie" DROP CONSTRAINT "UpvoteSerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteSerie" DROP CONSTRAINT "UpvoteSerie_serieReviewId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteSerie" DROP CONSTRAINT "UpvoteSerie_userId_fkey";

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "dateAired" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "releaseYear",
ADD COLUMN     "dateAired" TEXT NOT NULL DEFAULT '11/12/2005';

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "releaseYear",
ADD COLUMN     "dateAired" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "DownvoteMovie";

-- DropTable
DROP TABLE "DownvoteSerie";

-- DropTable
DROP TABLE "UpvoteMovie";

-- DropTable
DROP TABLE "UpvoteSerie";

-- CreateTable
CREATE TABLE "UserGenreFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "UserGenreFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastMovie" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "CastMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteMovieReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteMovieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteMovieReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "movieReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteMovieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CastSerie" (
    "id" SERIAL NOT NULL,
    "serieId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "CastSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteSerieReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteSerieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteSerieReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "serieReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteSerieReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonReview" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "SeasonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteSeasonReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "seasonReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteSeasonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteSeasonReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "seasonReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteSeasonReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodeReview" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "EpisodeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteEpisodeReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "episodeReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteEpisodeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteEpisodeReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "episodeReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteEpisodeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Actor',

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserGenreFavorite" ADD CONSTRAINT "UserGenreFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGenreFavorite" ADD CONSTRAINT "UserGenreFavorite_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastMovie" ADD CONSTRAINT "CastMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastMovie" ADD CONSTRAINT "CastMovie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteMovieReview" ADD CONSTRAINT "UpvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteMovieReview" ADD CONSTRAINT "UpvoteMovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteMovieReview" ADD CONSTRAINT "UpvoteMovieReview_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteMovieReview" ADD CONSTRAINT "DownvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteMovieReview" ADD CONSTRAINT "DownvoteMovieReview_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteMovieReview" ADD CONSTRAINT "DownvoteMovieReview_movieReviewId_fkey" FOREIGN KEY ("movieReviewId") REFERENCES "MovieReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastSerie" ADD CONSTRAINT "CastSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CastSerie" ADD CONSTRAINT "CastSerie_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSerieReview" ADD CONSTRAINT "UpvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSerieReview" ADD CONSTRAINT "UpvoteSerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSerieReview" ADD CONSTRAINT "UpvoteSerieReview_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSerieReview" ADD CONSTRAINT "DownvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSerieReview" ADD CONSTRAINT "DownvoteSerieReview_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSerieReview" ADD CONSTRAINT "DownvoteSerieReview_serieReviewId_fkey" FOREIGN KEY ("serieReviewId") REFERENCES "SerieReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonReview" ADD CONSTRAINT "SeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonReview" ADD CONSTRAINT "SeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSeasonReview" ADD CONSTRAINT "UpvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSeasonReview" ADD CONSTRAINT "UpvoteSeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSeasonReview" ADD CONSTRAINT "UpvoteSeasonReview_seasonReviewId_fkey" FOREIGN KEY ("seasonReviewId") REFERENCES "SeasonReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSeasonReview" ADD CONSTRAINT "DownvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSeasonReview" ADD CONSTRAINT "DownvoteSeasonReview_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSeasonReview" ADD CONSTRAINT "DownvoteSeasonReview_seasonReviewId_fkey" FOREIGN KEY ("seasonReviewId") REFERENCES "SeasonReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeReview" ADD CONSTRAINT "EpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeReview" ADD CONSTRAINT "EpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteEpisodeReview" ADD CONSTRAINT "UpvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteEpisodeReview" ADD CONSTRAINT "UpvoteEpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteEpisodeReview" ADD CONSTRAINT "UpvoteEpisodeReview_episodeReviewId_fkey" FOREIGN KEY ("episodeReviewId") REFERENCES "EpisodeReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteEpisodeReview" ADD CONSTRAINT "DownvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteEpisodeReview" ADD CONSTRAINT "DownvoteEpisodeReview_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteEpisodeReview" ADD CONSTRAINT "DownvoteEpisodeReview_episodeReviewId_fkey" FOREIGN KEY ("episodeReviewId") REFERENCES "EpisodeReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
