/*
  Warnings:

  - The `dateAired` column on the `Episode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateAired` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateAired` column on the `Season` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateAired` column on the `Serie` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "dateAired",
ADD COLUMN     "dateAired" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "dateAired",
ADD COLUMN     "dateAired" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "dateAired",
ADD COLUMN     "dateAired" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Serie" DROP COLUMN "dateAired",
ADD COLUMN     "dateAired" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Episode_dateAired_idx" ON "Episode"("dateAired");

-- CreateIndex
CREATE INDEX "Movie_dateAired_idx" ON "Movie"("dateAired");

-- CreateIndex
CREATE INDEX "Season_dateAired_idx" ON "Season"("dateAired");

-- CreateIndex
CREATE INDEX "Serie_dateAired_idx" ON "Serie"("dateAired");
