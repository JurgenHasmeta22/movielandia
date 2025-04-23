/*
  Warnings:

  - You are about to drop the `DownvoteForumPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteForumReply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DownvoteForumTopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DownvoteForumPost" DROP CONSTRAINT "DownvoteForumPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteForumPost" DROP CONSTRAINT "DownvoteForumPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteForumReply" DROP CONSTRAINT "DownvoteForumReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteForumReply" DROP CONSTRAINT "DownvoteForumReply_userId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteForumTopic" DROP CONSTRAINT "DownvoteForumTopic_topicId_fkey";

-- DropForeignKey
ALTER TABLE "DownvoteForumTopic" DROP CONSTRAINT "DownvoteForumTopic_userId_fkey";

-- DropTable
DROP TABLE "DownvoteForumPost";

-- DropTable
DROP TABLE "DownvoteForumReply";

-- DropTable
DROP TABLE "DownvoteForumTopic";
