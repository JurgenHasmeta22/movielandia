/*
  Warnings:

  - A unique constraint covering the columns `[userId,actorId]` on the table `ActorReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId,actorId]` on the table `CastMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serieId,actorId]` on the table `CastSerie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[crewId,movieId]` on the table `CrewMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,crewId]` on the table `CrewReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serieId,crewId]` on the table `CrewSerie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,actorId,actorReviewId]` on the table `DownvoteActorReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,crewId,crewReviewId]` on the table `DownvoteCrewReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,episodeId,episodeReviewId]` on the table `DownvoteEpisodeReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId,movieReviewId]` on the table `DownvoteMovieReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,seasonId,seasonReviewId]` on the table `DownvoteSeasonReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serieId,serieReviewId]` on the table `DownvoteSerieReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,episodeId]` on the table `EpisodeReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senderId,receiverId,inboxId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[genreId,movieId]` on the table `MovieGenre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,senderId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,seasonId]` on the table `SeasonReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serieId,genreId]` on the table `SerieGenre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serieId]` on the table `SerieReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,actorId,actorReviewId]` on the table `UpvoteActorReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,crewId,crewReviewId]` on the table `UpvoteCrewReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,episodeId,episodeReviewId]` on the table `UpvoteEpisodeReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId,movieReviewId]` on the table `UpvoteMovieReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,seasonId,seasonReviewId]` on the table `UpvoteSeasonReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serieId,serieReviewId]` on the table `UpvoteSerieReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,actorId]` on the table `UserActorFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,actorId]` on the table `UserActorRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,crewId]` on the table `UserCrewFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,crewId]` on the table `UserCrewRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,episodeId]` on the table `UserEpisodeFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,episodeId]` on the table `UserEpisodeRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `UserFollow` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,genreId]` on the table `UserGenreFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,inboxId]` on the table `UserInbox` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserMovieFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserMovieRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,seasonId]` on the table `UserSeasonFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,seasonId]` on the table `UserSeasonRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serieId]` on the table `UserSerieFavorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serieId]` on the table `UserSerieRating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CrewReview" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EpisodeReview" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "MovieReview" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SeasonReview" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SerieReview" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "ActorReview_userId_actorId_key" ON "ActorReview"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CastMovie_movieId_actorId_key" ON "CastMovie"("movieId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CastSerie_serieId_actorId_key" ON "CastSerie"("serieId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewMovie_crewId_movieId_key" ON "CrewMovie"("crewId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewReview_userId_crewId_key" ON "CrewReview"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewSerie_serieId_crewId_key" ON "CrewSerie"("serieId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteActorReview_userId_actorId_actorReviewId_key" ON "DownvoteActorReview"("userId", "actorId", "actorReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteCrewReview_userId_crewId_crewReviewId_key" ON "DownvoteCrewReview"("userId", "crewId", "crewReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteEpisodeReview_userId_episodeId_episodeReviewId_key" ON "DownvoteEpisodeReview"("userId", "episodeId", "episodeReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteMovieReview_userId_movieId_movieReviewId_key" ON "DownvoteMovieReview"("userId", "movieId", "movieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteSeasonReview_userId_seasonId_seasonReviewId_key" ON "DownvoteSeasonReview"("userId", "seasonId", "seasonReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteSerieReview_userId_serieId_serieReviewId_key" ON "DownvoteSerieReview"("userId", "serieId", "serieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeReview_userId_episodeId_key" ON "EpisodeReview"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_senderId_receiverId_inboxId_key" ON "Message"("senderId", "receiverId", "inboxId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieGenre_genreId_movieId_key" ON "MovieGenre"("genreId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_senderId_key" ON "Notification"("userId", "senderId");

-- CreateIndex
CREATE UNIQUE INDEX "SeasonReview_userId_seasonId_key" ON "SeasonReview"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "SerieGenre_serieId_genreId_key" ON "SerieGenre"("serieId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "SerieReview_userId_serieId_key" ON "SerieReview"("userId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteActorReview_userId_actorId_actorReviewId_key" ON "UpvoteActorReview"("userId", "actorId", "actorReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteCrewReview_userId_crewId_crewReviewId_key" ON "UpvoteCrewReview"("userId", "crewId", "crewReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteEpisodeReview_userId_episodeId_episodeReviewId_key" ON "UpvoteEpisodeReview"("userId", "episodeId", "episodeReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteMovieReview_userId_movieId_movieReviewId_key" ON "UpvoteMovieReview"("userId", "movieId", "movieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteSeasonReview_userId_seasonId_seasonReviewId_key" ON "UpvoteSeasonReview"("userId", "seasonId", "seasonReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteSerieReview_userId_serieId_serieReviewId_key" ON "UpvoteSerieReview"("userId", "serieId", "serieReviewId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActorFavorite_userId_actorId_key" ON "UserActorFavorite"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "UserActorRating_userId_actorId_key" ON "UserActorRating"("userId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCrewFavorite_userId_crewId_key" ON "UserCrewFavorite"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCrewRating_userId_crewId_key" ON "UserCrewRating"("userId", "crewId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEpisodeFavorite_userId_episodeId_key" ON "UserEpisodeFavorite"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserEpisodeRating_userId_episodeId_key" ON "UserEpisodeRating"("userId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followingId_key" ON "UserFollow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGenreFavorite_userId_genreId_key" ON "UserGenreFavorite"("userId", "genreId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInbox_userId_inboxId_key" ON "UserInbox"("userId", "inboxId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieFavorite_userId_movieId_key" ON "UserMovieFavorite"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMovieRating_userId_movieId_key" ON "UserMovieRating"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSeasonFavorite_userId_seasonId_key" ON "UserSeasonFavorite"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSeasonRating_userId_seasonId_key" ON "UserSeasonRating"("userId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSerieFavorite_userId_serieId_key" ON "UserSerieFavorite"("userId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSerieRating_userId_serieId_key" ON "UserSerieRating"("userId", "serieId");
