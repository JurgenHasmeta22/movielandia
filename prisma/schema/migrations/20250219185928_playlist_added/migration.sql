-- CreateEnum
CREATE TYPE "PlaylistType" AS ENUM ('Movie', 'Serie', 'Season', 'Episode', 'Actor', 'Crew');

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PlaylistType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistMovie" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistMovie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistSerie" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "serieId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistSerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistSeason" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistEpisode" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistActor" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistCrew" (
    "id" SERIAL NOT NULL,
    "playlistId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,

    CONSTRAINT "PlaylistCrew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistMovie_playlistId_movieId_key" ON "PlaylistMovie"("playlistId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSerie_playlistId_serieId_key" ON "PlaylistSerie"("playlistId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistSeason_playlistId_seasonId_key" ON "PlaylistSeason"("playlistId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistEpisode_playlistId_episodeId_key" ON "PlaylistEpisode"("playlistId", "episodeId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistActor_playlistId_actorId_key" ON "PlaylistActor"("playlistId", "actorId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistCrew_playlistId_crewId_key" ON "PlaylistCrew"("playlistId", "crewId");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMovie" ADD CONSTRAINT "PlaylistMovie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistMovie" ADD CONSTRAINT "PlaylistMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSerie" ADD CONSTRAINT "PlaylistSerie_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSerie" ADD CONSTRAINT "PlaylistSerie_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSeason" ADD CONSTRAINT "PlaylistSeason_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistSeason" ADD CONSTRAINT "PlaylistSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistEpisode" ADD CONSTRAINT "PlaylistEpisode_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistEpisode" ADD CONSTRAINT "PlaylistEpisode_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActor" ADD CONSTRAINT "PlaylistActor_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistActor" ADD CONSTRAINT "PlaylistActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCrew" ADD CONSTRAINT "PlaylistCrew_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistCrew" ADD CONSTRAINT "PlaylistCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;
