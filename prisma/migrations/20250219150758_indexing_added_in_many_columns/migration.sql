/*
  Warnings:

  - Made the column `fullname` on table `Actor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fullname` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Serie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "fullname" SET NOT NULL;

-- AlterTable
ALTER TABLE "Crew" ALTER COLUMN "fullname" SET NOT NULL;

-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Serie" ALTER COLUMN "title" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Actor_fullname_idx" ON "Actor"("fullname" ASC);

-- CreateIndex
CREATE INDEX "Actor_debut_idx" ON "Actor"("debut");

-- CreateIndex
CREATE INDEX "Crew_fullname_idx" ON "Crew"("fullname" DESC);

-- CreateIndex
CREATE INDEX "Episode_title_idx" ON "Episode"("title" ASC);

-- CreateIndex
CREATE INDEX "Episode_duration_idx" ON "Episode"("duration");

-- CreateIndex
CREATE INDEX "Episode_ratingImdb_idx" ON "Episode"("ratingImdb");

-- CreateIndex
CREATE INDEX "Episode_dateAired_idx" ON "Episode"("dateAired");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Movie_title_idx" ON "Movie"("title" ASC);

-- CreateIndex
CREATE INDEX "Movie_duration_idx" ON "Movie"("duration");

-- CreateIndex
CREATE INDEX "Movie_ratingImdb_idx" ON "Movie"("ratingImdb");

-- CreateIndex
CREATE INDEX "Movie_dateAired_idx" ON "Movie"("dateAired");

-- CreateIndex
CREATE INDEX "Season_title_idx" ON "Season"("title" ASC);

-- CreateIndex
CREATE INDEX "Season_ratingImdb_idx" ON "Season"("ratingImdb");

-- CreateIndex
CREATE INDEX "Season_dateAired_idx" ON "Season"("dateAired");

-- CreateIndex
CREATE INDEX "Serie_title_idx" ON "Serie"("title" ASC);

-- CreateIndex
CREATE INDEX "Serie_dateAired_idx" ON "Serie"("dateAired");

-- CreateIndex
CREATE INDEX "Serie_ratingImdb_idx" ON "Serie"("ratingImdb");

-- CreateIndex
CREATE INDEX "User_userName_idx" ON "User"("userName" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
