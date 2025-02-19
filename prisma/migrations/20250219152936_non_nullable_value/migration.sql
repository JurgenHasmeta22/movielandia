/*
  Warnings:

  - Made the column `debut` on table `Actor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Actor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Actor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Actor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `debut` on table `Crew` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateAired` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trailerSrc` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratingImdb` on table `Episode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Genre` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trailerSrc` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratingImdb` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateAired` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `Movie` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratingImdb` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateAired` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trailerSrc` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Season` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrc` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photoSrcProd` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trailerSrc` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratingImdb` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateAired` on table `Serie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('follow_request', 'message_received', 'liked_review', 'disliked_review');

-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "debut" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL;

-- AlterTable
ALTER TABLE "Crew" ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "debut" SET NOT NULL;

-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "dateAired" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "trailerSrc" SET NOT NULL,
ALTER COLUMN "ratingImdb" SET NOT NULL;

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL,
ALTER COLUMN "trailerSrc" SET NOT NULL,
ALTER COLUMN "ratingImdb" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "dateAired" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL,
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL,
ALTER COLUMN "ratingImdb" SET NOT NULL,
ALTER COLUMN "dateAired" SET NOT NULL,
ALTER COLUMN "trailerSrc" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Serie" ALTER COLUMN "photoSrc" SET NOT NULL,
ALTER COLUMN "photoSrcProd" SET NOT NULL,
ALTER COLUMN "trailerSrc" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "ratingImdb" SET NOT NULL,
ALTER COLUMN "dateAired" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET NOT NULL;
