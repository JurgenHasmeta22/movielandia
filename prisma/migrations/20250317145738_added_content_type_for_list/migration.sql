-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('movie', 'serie', 'season', 'episode', 'actor', 'crew', 'user');

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "contentType" "ContentType";
