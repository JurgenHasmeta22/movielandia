/*
  Warnings:

  - You are about to alter the column `userId` on the `ActivateToken` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `ActorReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `Avatar` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `DownvoteActorReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `DownvoteEpisodeReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `DownvoteMovieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `DownvoteSeasonReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `DownvoteSerieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `EpisodeReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `senderId` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `receiverId` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `MovieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `ResetPasswordToken` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `SeasonReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `SerieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UpvoteActorReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UpvoteEpisodeReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UpvoteMovieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UpvoteSeasonReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UpvoteSerieReview` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserActorFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserActorRating` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserEpisodeFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserEpisodeRating` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `followerId` on the `UserFollow` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `followingId` on the `UserFollow` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserGenreFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserInbox` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserMovieFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserMovieRating` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserSeasonFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserSeasonRating` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserSerieFavorite` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `userId` on the `UserSerieRating` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "ActivateToken" DROP CONSTRAINT "ActivateToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "ActorReview" DROP CONSTRAINT "ActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteActorReview" DROP CONSTRAINT "DownvoteActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteEpisodeReview" DROP CONSTRAINT "DownvoteEpisodeReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteMovieReview" DROP CONSTRAINT "DownvoteMovieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteSeasonReview" DROP CONSTRAINT "DownvoteSeasonReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteSerieReview" DROP CONSTRAINT "DownvoteSerieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "EpisodeReview" DROP CONSTRAINT "EpisodeReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "MovieReview" DROP CONSTRAINT "MovieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResetPasswordToken" DROP CONSTRAINT "ResetPasswordToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "SeasonReview" DROP CONSTRAINT "SeasonReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "SerieReview" DROP CONSTRAINT "SerieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteActorReview" DROP CONSTRAINT "UpvoteActorReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteEpisodeReview" DROP CONSTRAINT "UpvoteEpisodeReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteMovieReview" DROP CONSTRAINT "UpvoteMovieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteSeasonReview" DROP CONSTRAINT "UpvoteSeasonReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UpvoteSerieReview" DROP CONSTRAINT "UpvoteSerieReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorFavorite" DROP CONSTRAINT "UserActorFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserActorRating" DROP CONSTRAINT "UserActorRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserEpisodeFavorite" DROP CONSTRAINT "UserEpisodeFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserEpisodeRating" DROP CONSTRAINT "UserEpisodeRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "UserGenreFavorite" DROP CONSTRAINT "UserGenreFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserInbox" DROP CONSTRAINT "UserInbox_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserMovieFavorite" DROP CONSTRAINT "UserMovieFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserMovieRating" DROP CONSTRAINT "UserMovieRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSeasonFavorite" DROP CONSTRAINT "UserSeasonFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSeasonRating" DROP CONSTRAINT "UserSeasonRating_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSerieFavorite" DROP CONSTRAINT "UserSerieFavorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSerieRating" DROP CONSTRAINT "UserSerieRating_userId_fkey";

-- AlterTable
ALTER TABLE "ActivateToken" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ActorReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Avatar" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DownvoteActorReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DownvoteEpisodeReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DownvoteMovieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DownvoteSeasonReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DownvoteSerieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "EpisodeReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "senderId" SET DATA TYPE INTEGER,
ALTER COLUMN "receiverId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "MovieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ResetPasswordToken" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SeasonReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SerieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UpvoteActorReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UpvoteEpisodeReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UpvoteMovieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UpvoteSeasonReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UpvoteSerieReview" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserActorFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserActorRating" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserEpisodeFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserEpisodeRating" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserFollow" ALTER COLUMN "followerId" SET DATA TYPE INTEGER,
ALTER COLUMN "followingId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserGenreFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserInbox" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserMovieFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserMovieRating" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserSeasonFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserSeasonRating" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserSerieFavorite" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserSerieRating" ALTER COLUMN "userId" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "ActorReview" ADD CONSTRAINT "ActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteActorReview" ADD CONSTRAINT "UpvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteActorReview" ADD CONSTRAINT "DownvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeReview" ADD CONSTRAINT "EpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteEpisodeReview" ADD CONSTRAINT "UpvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteEpisodeReview" ADD CONSTRAINT "DownvoteEpisodeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieReview" ADD CONSTRAINT "MovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteMovieReview" ADD CONSTRAINT "UpvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteMovieReview" ADD CONSTRAINT "DownvoteMovieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonReview" ADD CONSTRAINT "SeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSeasonReview" ADD CONSTRAINT "UpvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSeasonReview" ADD CONSTRAINT "DownvoteSeasonReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteSerieReview" ADD CONSTRAINT "UpvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteSerieReview" ADD CONSTRAINT "DownvoteSerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieReview" ADD CONSTRAINT "SerieReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivateToken" ADD CONSTRAINT "ActivateToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInbox" ADD CONSTRAINT "UserInbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovieRating" ADD CONSTRAINT "UserMovieRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSerieRating" ADD CONSTRAINT "UserSerieRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeasonRating" ADD CONSTRAINT "UserSeasonRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEpisodeRating" ADD CONSTRAINT "UserEpisodeRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActorRating" ADD CONSTRAINT "UserActorRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMovieFavorite" ADD CONSTRAINT "UserMovieFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGenreFavorite" ADD CONSTRAINT "UserGenreFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSerieFavorite" ADD CONSTRAINT "UserSerieFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEpisodeFavorite" ADD CONSTRAINT "UserEpisodeFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeasonFavorite" ADD CONSTRAINT "UserSeasonFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActorFavorite" ADD CONSTRAINT "UserActorFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
