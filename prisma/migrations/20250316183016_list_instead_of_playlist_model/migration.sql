/*
  Warnings:

  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivityActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivityCrew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivityEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivityMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivitySeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActivitySerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistActor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistCrew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistEpisode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistSeason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistSerie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlaylistShare` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPlaylistStats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListActionType" AS ENUM ('Created', 'Updated', 'Deleted', 'ItemAdded', 'ItemRemoved', 'Shared', 'Unshared');

-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityActor" DROP CONSTRAINT "PlaylistActivityActor_actorId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityActor" DROP CONSTRAINT "PlaylistActivityActor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityActor" DROP CONSTRAINT "PlaylistActivityActor_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityCrew" DROP CONSTRAINT "PlaylistActivityCrew_crewId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityCrew" DROP CONSTRAINT "PlaylistActivityCrew_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityCrew" DROP CONSTRAINT "PlaylistActivityCrew_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityEpisode" DROP CONSTRAINT "PlaylistActivityEpisode_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityEpisode" DROP CONSTRAINT "PlaylistActivityEpisode_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityEpisode" DROP CONSTRAINT "PlaylistActivityEpisode_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityMovie" DROP CONSTRAINT "PlaylistActivityMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityMovie" DROP CONSTRAINT "PlaylistActivityMovie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivityMovie" DROP CONSTRAINT "PlaylistActivityMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySeason" DROP CONSTRAINT "PlaylistActivitySeason_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySeason" DROP CONSTRAINT "PlaylistActivitySeason_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySeason" DROP CONSTRAINT "PlaylistActivitySeason_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySerie" DROP CONSTRAINT "PlaylistActivitySerie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySerie" DROP CONSTRAINT "PlaylistActivitySerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActivitySerie" DROP CONSTRAINT "PlaylistActivitySerie_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActor" DROP CONSTRAINT "PlaylistActor_actorId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActor" DROP CONSTRAINT "PlaylistActor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistActor" DROP CONSTRAINT "PlaylistActor_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistCrew" DROP CONSTRAINT "PlaylistCrew_crewId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistCrew" DROP CONSTRAINT "PlaylistCrew_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistCrew" DROP CONSTRAINT "PlaylistCrew_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistEpisode" DROP CONSTRAINT "PlaylistEpisode_episodeId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistEpisode" DROP CONSTRAINT "PlaylistEpisode_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistEpisode" DROP CONSTRAINT "PlaylistEpisode_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistMovie" DROP CONSTRAINT "PlaylistMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistMovie" DROP CONSTRAINT "PlaylistMovie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistMovie" DROP CONSTRAINT "PlaylistMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSeason" DROP CONSTRAINT "PlaylistSeason_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSeason" DROP CONSTRAINT "PlaylistSeason_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSeason" DROP CONSTRAINT "PlaylistSeason_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSerie" DROP CONSTRAINT "PlaylistSerie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSerie" DROP CONSTRAINT "PlaylistSerie_serieId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistSerie" DROP CONSTRAINT "PlaylistSerie_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistShare" DROP CONSTRAINT "PlaylistShare_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistShare" DROP CONSTRAINT "PlaylistShare_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserPlaylistStats" DROP CONSTRAINT "UserPlaylistStats_userId_fkey";

-- DropTable
DROP TABLE "Playlist";

-- DropTable
DROP TABLE "PlaylistActivityActor";

-- DropTable
DROP TABLE "PlaylistActivityCrew";

-- DropTable
DROP TABLE "PlaylistActivityEpisode";

-- DropTable
DROP TABLE "PlaylistActivityMovie";

-- DropTable
DROP TABLE "PlaylistActivitySeason";

-- DropTable
DROP TABLE "PlaylistActivitySerie";

-- DropTable
DROP TABLE "PlaylistActor";

-- DropTable
DROP TABLE "PlaylistCrew";

-- DropTable
DROP TABLE "PlaylistEpisode";

-- DropTable
DROP TABLE "PlaylistMovie";

-- DropTable
DROP TABLE "PlaylistSeason";

-- DropTable
DROP TABLE "PlaylistSerie";

-- DropTable
DROP TABLE "PlaylistShare";

-- DropTable
DROP TABLE "UserPlaylistStats";

-- DropEnum
DROP TYPE "PlaylistActionType";

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastViewedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListShare" (
    "id" SERIAL NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListMovie" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListSerie" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListSeason" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListEpisode" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActor" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListCrew" (
    "id" SERIAL NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "playlistId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivityMovie" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivityMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivitySerie" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivitySerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivitySeason" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivitySeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivityEpisode" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivityEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivityActor" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivityActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListActivityCrew" (
    "id" SERIAL NOT NULL,
    "actionType" "ListActionType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ListActivityCrew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserListStats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalLists" INTEGER NOT NULL DEFAULT 0,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "sharedLists" INTEGER NOT NULL DEFAULT 0,
    "lastListAt" TIMESTAMP(3),

    CONSTRAINT "UserListStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "List_createdAt_idx" ON "List"("createdAt");

-- CreateIndex
CREATE INDEX "List_isDefault_idx" ON "List"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "ListShare_playlistId_userId_key" ON "ListShare"("playlistId", "userId");

-- CreateIndex
CREATE INDEX "ListMovie_playlistId_orderIndex_idx" ON "ListMovie"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListMovie_playlistId_movieId_key" ON "ListMovie"("playlistId", "movieId");

-- CreateIndex
CREATE INDEX "ListSerie_playlistId_orderIndex_idx" ON "ListSerie"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSerie_playlistId_serieId_key" ON "ListSerie"("playlistId", "serieId");

-- CreateIndex
CREATE INDEX "ListSeason_playlistId_orderIndex_idx" ON "ListSeason"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSeason_playlistId_seasonId_key" ON "ListSeason"("playlistId", "seasonId");

-- CreateIndex
CREATE INDEX "ListEpisode_playlistId_orderIndex_idx" ON "ListEpisode"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListEpisode_playlistId_episodeId_key" ON "ListEpisode"("playlistId", "episodeId");

-- CreateIndex
CREATE INDEX "ListActor_playlistId_orderIndex_idx" ON "ListActor"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListActor_playlistId_actorId_key" ON "ListActor"("playlistId", "actorId");

-- CreateIndex
CREATE INDEX "ListCrew_playlistId_orderIndex_idx" ON "ListCrew"("playlistId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListCrew_playlistId_crewId_key" ON "ListCrew"("playlistId", "crewId");

-- CreateIndex
CREATE INDEX "ListActivityMovie_playlistId_createdAt_idx" ON "ListActivityMovie"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityMovie_userId_createdAt_idx" ON "ListActivityMovie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySerie_playlistId_createdAt_idx" ON "ListActivitySerie"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySerie_userId_createdAt_idx" ON "ListActivitySerie"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySeason_playlistId_createdAt_idx" ON "ListActivitySeason"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySeason_userId_createdAt_idx" ON "ListActivitySeason"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityEpisode_playlistId_createdAt_idx" ON "ListActivityEpisode"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityEpisode_userId_createdAt_idx" ON "ListActivityEpisode"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityActor_playlistId_createdAt_idx" ON "ListActivityActor"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityActor_userId_createdAt_idx" ON "ListActivityActor"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityCrew_playlistId_createdAt_idx" ON "ListActivityCrew"("playlistId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityCrew_userId_createdAt_idx" ON "ListActivityCrew"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserListStats_userId_key" ON "UserListStats"("userId");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListShare" ADD CONSTRAINT "ListShare_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListShare" ADD CONSTRAINT "ListShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSerie" ADD CONSTRAINT "ListSerie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSerie" ADD CONSTRAINT "ListSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSerie" ADD CONSTRAINT "ListSerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSeason" ADD CONSTRAINT "ListSeason_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSeason" ADD CONSTRAINT "ListSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSeason" ADD CONSTRAINT "ListSeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEpisode" ADD CONSTRAINT "ListEpisode_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEpisode" ADD CONSTRAINT "ListEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEpisode" ADD CONSTRAINT "ListEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActor" ADD CONSTRAINT "ListActor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActor" ADD CONSTRAINT "ListActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActor" ADD CONSTRAINT "ListActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCrew" ADD CONSTRAINT "ListCrew_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCrew" ADD CONSTRAINT "ListCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCrew" ADD CONSTRAINT "ListCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityMovie" ADD CONSTRAINT "ListActivityMovie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityMovie" ADD CONSTRAINT "ListActivityMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityMovie" ADD CONSTRAINT "ListActivityMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySerie" ADD CONSTRAINT "ListActivitySerie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySerie" ADD CONSTRAINT "ListActivitySerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySerie" ADD CONSTRAINT "ListActivitySerie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySeason" ADD CONSTRAINT "ListActivitySeason_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySeason" ADD CONSTRAINT "ListActivitySeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySeason" ADD CONSTRAINT "ListActivitySeason_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityEpisode" ADD CONSTRAINT "ListActivityEpisode_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityEpisode" ADD CONSTRAINT "ListActivityEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityEpisode" ADD CONSTRAINT "ListActivityEpisode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityActor" ADD CONSTRAINT "ListActivityActor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityActor" ADD CONSTRAINT "ListActivityActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityActor" ADD CONSTRAINT "ListActivityActor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityCrew" ADD CONSTRAINT "ListActivityCrew_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityCrew" ADD CONSTRAINT "ListActivityCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityCrew" ADD CONSTRAINT "ListActivityCrew_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserListStats" ADD CONSTRAINT "UserListStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
