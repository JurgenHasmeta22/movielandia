-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "trailerSrc" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "trailerSrc" TEXT NOT NULL DEFAULT '';
