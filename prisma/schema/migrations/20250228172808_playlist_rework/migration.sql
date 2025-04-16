/*
  Warnings:

  - The values [DELETE_REVIEW,DELETE_COMMENT,BAN_USER,WARN_USER] on the enum `ModerationAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [Movie,Serie,Season,Episode,Actor,Crew] on the enum `PlaylistType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,RESOLVED,REJECTED] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REVIEW,COMMENT,USER,MESSAGE,OTHER] on the enum `ReportType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `PlaylistActor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PlaylistCrew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PlaylistEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PlaylistMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PlaylistSeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PlaylistSerie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlaylistActionType" AS ENUM ('Created', 'Updated', 'Deleted', 'ItemAdded', 'ItemRemoved', 'Shared', 'Unshared');

-- AlterEnum
BEGIN;
CREATE TYPE "ModerationAction_new" AS ENUM ('DeleteReview', 'DeleteComment', 'BanUser', 'WarnUser');
ALTER TABLE "ModerationLog" ALTER COLUMN "actionType" TYPE "ModerationAction_new" USING ("actionType"::text::"ModerationAction_new");
ALTER TYPE "ModerationAction" RENAME TO "ModerationAction_old";
ALTER TYPE "ModerationAction_new" RENAME TO "ModerationAction";
DROP TYPE "ModerationAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PlaylistType_new" AS ENUM ('Custom', 'Watchlist', 'Favorites', 'Watched');
ALTER TABLE "Playlist" ALTER COLUMN "type" TYPE "PlaylistType_new" USING ("type"::text::"PlaylistType_new");
ALTER TYPE "PlaylistType" RENAME TO "PlaylistType_old";
ALTER TYPE "PlaylistType_new" RENAME TO "PlaylistType";
DROP TYPE "PlaylistType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('Pending', 'Resolved', 'Rejected');
ALTER TABLE "ReportedContent" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ReportedContent" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "ReportedContent" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReportType_new" AS ENUM ('Review', 'Comment', 'User', 'Message', 'Other');
ALTER TABLE "ReportedContent" ALTER COLUMN "reportType" TYPE "ReportType_new" USING ("reportType"::text::"ReportType_new");
ALTER TYPE "ReportType" RENAME TO "ReportType_old";
ALTER TYPE "ReportType_new" RENAME TO "ReportType";
DROP TYPE "ReportType_old";
COMMIT;

-- DropIndex
DROP INDEX "Crew_fullname_idx";

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itemCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastViewedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PlaylistActor" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistCrew" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistEpisode" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistMovie" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistSeason" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlaylistSerie" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ReportedContent" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "PlaylistShare" (
    "id" SERIAL NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivityMovie" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivityMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivitySerie" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivitySerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivitySeason" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivitySeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivityEpisode" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivityEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivityActor" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivityActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActivityCrew" (
    "id" SERIAL NOT NULL,
    "actionType" "PlaylistActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActivityCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlaylistStats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalPlaylists" INTEGER NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "sharedPlaylists" INTEGER NOT NULL DEFAULT 0,
    "lastPlaylistAt" TIMESTAMP(3),

    CONSTRAINT "UserPlaylistStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistShare_playlistId_userId_key" ON "PlaylistShare"("playlistId", "userId");

-- CreateIndex
CREATE INDEX "PlaylistActivityMovie_playlistId_createdAt_idx" ON "PlaylistActivityMovie"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityMovie_userId_createdAt_idx" ON "PlaylistActivityMovie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivitySerie_playlistId_createdAt_idx" ON "PlaylistActivitySerie"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivitySerie_userId_createdAt_idx" ON "PlaylistActivitySerie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivitySeason_playlistId_createdAt_idx" ON "PlaylistActivitySeason"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivitySeason_userId_createdAt_idx" ON "PlaylistActivitySeason"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityEpisode_playlistId_createdAt_idx" ON "PlaylistActivityEpisode"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityEpisode_userId_createdAt_idx" ON "PlaylistActivityEpisode"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityActor_playlistId_createdAt_idx" ON "PlaylistActivityActor"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityActor_userId_createdAt_idx" ON "PlaylistActivityActor"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityCrew_playlistId_createdAt_idx" ON "PlaylistActivityCrew"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaylistActivityCrew_userId_createdAt_idx" ON "PlaylistActivityCrew"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPlaylistStats_userId_key" ON "UserPlaylistStats"("userId");

-- CreateIndex
CREATE INDEX "Crew_fullname_idx" ON "Crew"("fullname" ASC);

-- CreateIndex
CREATE INDEX "Playlist_userId_idx" ON "Playlist"("userId");

-- CreateIndex
CREATE INDEX "Playlist_type_idx" ON "Playlist"("type");

-- CreateIndex
CREATE INDEX "Playlist_createdAt_idx" ON "Playlist"("createdAt");

-- CreateIndex
CREATE INDEX "Playlist_isDefault_idx" ON "Playlist"("isDefault");

-- CreateIndex
CREATE INDEX "PlaylistActor_playlistId_orderIndex_idx" ON "PlaylistActor"("playlistId", "orderIndex");

-- CreateIndex
CREATE INDEX "PlaylistCrew_playlistId_orderIndex_idx" ON "PlaylistCrew"("playlistId", "orderIndex");

-- CreateIndex
CREATE INDEX "PlaylistEpisode_playlistId_orderIndex_idx" ON "PlaylistEpisode"("playlistId", "orderIndex");

-- CreateIndex
CREATE INDEX "PlaylistMovie_playlistId_orderIndex_idx" ON "PlaylistMovie"("playlistId", "orderIndex");

-- CreateIndex
CREATE INDEX "PlaylistSeason_playlistId_orderIndex_idx" ON "PlaylistSeason"("playlistId", "orderIndex");

-- CreateIndex
CREATE INDEX "PlaylistSerie_playlistId_orderIndex_idx" ON "PlaylistSerie"("playlistId", "orderIndex");

-- AddForeignKey
ALTER TABLE "PlaylistShare" ADD CONSTRAINT "PlaylistShare_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistShare" ADD CONSTRAINT "PlaylistShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMovie" ADD CONSTRAINT "PlaylistMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSerie" ADD CONSTRAINT "PlaylistSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSeason" ADD CONSTRAINT "PlaylistSeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistEpisode" ADD CONSTRAINT "PlaylistEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActor" ADD CONSTRAINT "PlaylistActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCrew" ADD CONSTRAINT "PlaylistCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityMovie" ADD CONSTRAINT "PlaylistActivityMovie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityMovie" ADD CONSTRAINT "PlaylistActivityMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityMovie" ADD CONSTRAINT "PlaylistActivityMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySerie" ADD CONSTRAINT "PlaylistActivitySerie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySerie" ADD CONSTRAINT "PlaylistActivitySerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySerie" ADD CONSTRAINT "PlaylistActivitySerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySeason" ADD CONSTRAINT "PlaylistActivitySeason_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySeason" ADD CONSTRAINT "PlaylistActivitySeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivitySeason" ADD CONSTRAINT "PlaylistActivitySeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityEpisode" ADD CONSTRAINT "PlaylistActivityEpisode_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityEpisode" ADD CONSTRAINT "PlaylistActivityEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityEpisode" ADD CONSTRAINT "PlaylistActivityEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityActor" ADD CONSTRAINT "PlaylistActivityActor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityActor" ADD CONSTRAINT "PlaylistActivityActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityActor" ADD CONSTRAINT "PlaylistActivityActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityCrew" ADD CONSTRAINT "PlaylistActivityCrew_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityCrew" ADD CONSTRAINT "PlaylistActivityCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActivityCrew" ADD CONSTRAINT "PlaylistActivityCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlaylistStats" ADD CONSTRAINT "UserPlaylistStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
