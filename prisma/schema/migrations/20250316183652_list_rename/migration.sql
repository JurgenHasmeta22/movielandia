/*
  Warnings:

  - You are about to drop the column `playlistId` on the `ListActivityActor` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActivityCrew` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActivityEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActivityMovie` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActivitySeason` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActivitySerie` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListActor` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListCrew` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListMovie` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListSeason` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListSerie` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `ListShare` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listId,actorId]` on the table `ListActor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,crewId]` on the table `ListCrew` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,episodeId]` on the table `ListEpisode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,movieId]` on the table `ListMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,seasonId]` on the table `ListSeason` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,serieId]` on the table `ListSerie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listId,userId]` on the table `ListShare` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listId` to the `ListActivityActor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActivityCrew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActivityEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActivityMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActivitySeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActivitySerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListActor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListCrew` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListSeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListSerie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listId` to the `ListShare` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListActivityActor" DROP CONSTRAINT "ListActivityActor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActivityCrew" DROP CONSTRAINT "ListActivityCrew_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActivityEpisode" DROP CONSTRAINT "ListActivityEpisode_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActivityMovie" DROP CONSTRAINT "ListActivityMovie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActivitySeason" DROP CONSTRAINT "ListActivitySeason_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActivitySerie" DROP CONSTRAINT "ListActivitySerie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListActor" DROP CONSTRAINT "ListActor_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListCrew" DROP CONSTRAINT "ListCrew_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListEpisode" DROP CONSTRAINT "ListEpisode_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListMovie" DROP CONSTRAINT "ListMovie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListSeason" DROP CONSTRAINT "ListSeason_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListSerie" DROP CONSTRAINT "ListSerie_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "ListShare" DROP CONSTRAINT "ListShare_playlistId_fkey";

-- DropIndex
DROP INDEX "ListActivityActor_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActivityCrew_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActivityEpisode_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActivityMovie_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActivitySeason_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActivitySerie_playlistId_createdAt_idx";

-- DropIndex
DROP INDEX "ListActor_playlistId_actorId_key";

-- DropIndex
DROP INDEX "ListActor_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListCrew_playlistId_crewId_key";

-- DropIndex
DROP INDEX "ListCrew_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListEpisode_playlistId_episodeId_key";

-- DropIndex
DROP INDEX "ListEpisode_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListMovie_playlistId_movieId_key";

-- DropIndex
DROP INDEX "ListMovie_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListSeason_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListSeason_playlistId_seasonId_key";

-- DropIndex
DROP INDEX "ListSerie_playlistId_orderIndex_idx";

-- DropIndex
DROP INDEX "ListSerie_playlistId_serieId_key";

-- DropIndex
DROP INDEX "ListShare_playlistId_userId_key";

-- AlterTable
ALTER TABLE "ListActivityActor" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActivityCrew" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActivityEpisode" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActivityMovie" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActivitySeason" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActivitySerie" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListActor" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListCrew" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListEpisode" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListMovie" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListSeason" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListSerie" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ListShare" DROP COLUMN "playlistId",
ADD COLUMN     "listId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ListActivityActor_listId_createdAt_idx" ON "ListActivityActor"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityCrew_listId_createdAt_idx" ON "ListActivityCrew"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityEpisode_listId_createdAt_idx" ON "ListActivityEpisode"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivityMovie_listId_createdAt_idx" ON "ListActivityMovie"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySeason_listId_createdAt_idx" ON "ListActivitySeason"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActivitySerie_listId_createdAt_idx" ON "ListActivitySerie"("listId", "createdAt");

-- CreateIndex
CREATE INDEX "ListActor_listId_orderIndex_idx" ON "ListActor"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListActor_listId_actorId_key" ON "ListActor"("listId", "actorId");

-- CreateIndex
CREATE INDEX "ListCrew_listId_orderIndex_idx" ON "ListCrew"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListCrew_listId_crewId_key" ON "ListCrew"("listId", "crewId");

-- CreateIndex
CREATE INDEX "ListEpisode_listId_orderIndex_idx" ON "ListEpisode"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListEpisode_listId_episodeId_key" ON "ListEpisode"("listId", "episodeId");

-- CreateIndex
CREATE INDEX "ListMovie_listId_orderIndex_idx" ON "ListMovie"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListMovie_listId_movieId_key" ON "ListMovie"("listId", "movieId");

-- CreateIndex
CREATE INDEX "ListSeason_listId_orderIndex_idx" ON "ListSeason"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSeason_listId_seasonId_key" ON "ListSeason"("listId", "seasonId");

-- CreateIndex
CREATE INDEX "ListSerie_listId_orderIndex_idx" ON "ListSerie"("listId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "ListSerie_listId_serieId_key" ON "ListSerie"("listId", "serieId");

-- CreateIndex
CREATE UNIQUE INDEX "ListShare_listId_userId_key" ON "ListShare"("listId", "userId");

-- AddForeignKey
ALTER TABLE "ListShare" ADD CONSTRAINT "ListShare_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSerie" ADD CONSTRAINT "ListSerie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListSeason" ADD CONSTRAINT "ListSeason_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEpisode" ADD CONSTRAINT "ListEpisode_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActor" ADD CONSTRAINT "ListActor_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListCrew" ADD CONSTRAINT "ListCrew_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityMovie" ADD CONSTRAINT "ListActivityMovie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySerie" ADD CONSTRAINT "ListActivitySerie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivitySeason" ADD CONSTRAINT "ListActivitySeason_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityEpisode" ADD CONSTRAINT "ListActivityEpisode_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityActor" ADD CONSTRAINT "ListActivityActor_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListActivityCrew" ADD CONSTRAINT "ListActivityCrew_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
