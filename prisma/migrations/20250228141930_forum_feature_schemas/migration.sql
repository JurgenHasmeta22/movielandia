-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Normal', 'Announcement', 'Sticky', 'Question', 'Answered');

-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('Open', 'Closed', 'Archived');

-- CreateTable
CREATE TABLE "ForumCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "topicCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" TIMESTAMP(3),
    "lastPostId" INTEGER,

    CONSTRAINT "ForumCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserForumModerator" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "UserForumModerator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editCount" INTEGER NOT NULL DEFAULT 0,
    "lastEditAt" TIMESTAMP(3),
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'Normal',
    "isAnswer" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3),
    "answeredById" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedById" INTEGER,
    "topicId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteForumPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteForumPost" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPostHistory" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedById" INTEGER NOT NULL,

    CONSTRAINT "ForumPostHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumReply" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editCount" INTEGER NOT NULL DEFAULT 0,
    "lastEditAt" TIMESTAMP(3),
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ForumReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteForumReply" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteForumReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteForumReply" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "replyId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteForumReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumReplyHistory" (
    "id" SERIAL NOT NULL,
    "replyId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedById" INTEGER NOT NULL,

    CONSTRAINT "ForumReplyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumTopic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "status" "TopicStatus" NOT NULL DEFAULT 'Open',
    "closedAt" TIMESTAMP(3),
    "closedById" INTEGER,
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ForumTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserForumTopicWatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "UserForumTopicWatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserForumTopicFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "UserForumTopicFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteForumTopic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteForumTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteForumTopic" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteForumTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumUserStats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "upvotesReceived" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "lastPostAt" TIMESTAMP(3),

    CONSTRAINT "ForumUserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ForumTagToForumTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ForumTagToForumTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_slug_key" ON "ForumCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCategory_lastPostId_key" ON "ForumCategory"("lastPostId");

-- CreateIndex
CREATE INDEX "ForumCategory_name_idx" ON "ForumCategory"("name" ASC);

-- CreateIndex
CREATE INDEX "ForumCategory_order_idx" ON "ForumCategory"("order");

-- CreateIndex
CREATE INDEX "ForumCategory_lastPostId_idx" ON "ForumCategory"("lastPostId");

-- CreateIndex
CREATE INDEX "ForumCategory_isActive_order_idx" ON "ForumCategory"("isActive", "order");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumModerator_userId_categoryId_key" ON "UserForumModerator"("userId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumPost_slug_key" ON "ForumPost"("slug");

-- CreateIndex
CREATE INDEX "ForumPost_createdAt_idx" ON "ForumPost"("createdAt");

-- CreateIndex
CREATE INDEX "ForumPost_isModerated_idx" ON "ForumPost"("isModerated");

-- CreateIndex
CREATE INDEX "ForumPost_topicId_idx" ON "ForumPost"("topicId");

-- CreateIndex
CREATE INDEX "ForumPost_isDeleted_idx" ON "ForumPost"("isDeleted");

-- CreateIndex
CREATE INDEX "ForumPost_answeredAt_idx" ON "ForumPost"("answeredAt");

-- CreateIndex
CREATE INDEX "Attachment_uploadedAt_idx" ON "Attachment"("uploadedAt");

-- CreateIndex
CREATE INDEX "Attachment_mimeType_idx" ON "Attachment"("mimeType");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumPost_userId_postId_key" ON "UpvoteForumPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumPost_userId_postId_key" ON "DownvoteForumPost"("userId", "postId");

-- CreateIndex
CREATE INDEX "ForumReply_createdAt_idx" ON "ForumReply"("createdAt");

-- CreateIndex
CREATE INDEX "ForumReply_isModerated_idx" ON "ForumReply"("isModerated");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumReply_userId_replyId_key" ON "UpvoteForumReply"("userId", "replyId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumReply_userId_replyId_key" ON "DownvoteForumReply"("userId", "replyId");

-- CreateIndex
CREATE INDEX "ForumReplyHistory_editedAt_idx" ON "ForumReplyHistory"("editedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTag_name_key" ON "ForumTag"("name");

-- CreateIndex
CREATE INDEX "ForumTag_name_idx" ON "ForumTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ForumTopic_slug_key" ON "ForumTopic"("slug");

-- CreateIndex
CREATE INDEX "ForumTopic_title_idx" ON "ForumTopic"("title" ASC);

-- CreateIndex
CREATE INDEX "ForumTopic_createdAt_idx" ON "ForumTopic"("createdAt");

-- CreateIndex
CREATE INDEX "ForumTopic_lastPostAt_idx" ON "ForumTopic"("lastPostAt");

-- CreateIndex
CREATE INDEX "ForumTopic_isPinned_idx" ON "ForumTopic"("isPinned");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumTopicWatch_userId_topicId_key" ON "UserForumTopicWatch"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserForumTopicFavorite_userId_topicId_key" ON "UserForumTopicFavorite"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "UpvoteForumTopic_userId_topicId_key" ON "UpvoteForumTopic"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "DownvoteForumTopic_userId_topicId_key" ON "DownvoteForumTopic"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumUserStats_userId_key" ON "ForumUserStats"("userId");

-- CreateIndex
CREATE INDEX "_ForumTagToForumTopic_B_index" ON "_ForumTagToForumTopic"("B");

-- AddForeignKey
ALTER TABLE "ForumCategory" ADD CONSTRAINT "ForumCategory_lastPostId_fkey" FOREIGN KEY ("lastPostId") REFERENCES "ForumPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumModerator" ADD CONSTRAINT "UserForumModerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumModerator" ADD CONSTRAINT "UserForumModerator_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_answeredById_fkey" FOREIGN KEY ("answeredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumPost" ADD CONSTRAINT "UpvoteForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumPost" ADD CONSTRAINT "UpvoteForumPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumPost" ADD CONSTRAINT "DownvoteForumPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumPost" ADD CONSTRAINT "DownvoteForumPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPostHistory" ADD CONSTRAINT "ForumPostHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPostHistory" ADD CONSTRAINT "ForumPostHistory_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumReply" ADD CONSTRAINT "UpvoteForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumReply" ADD CONSTRAINT "UpvoteForumReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumReply" ADD CONSTRAINT "DownvoteForumReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumReply" ADD CONSTRAINT "DownvoteForumReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReplyHistory" ADD CONSTRAINT "ForumReplyHistory_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "ForumReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReplyHistory" ADD CONSTRAINT "ForumReplyHistory_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumTopic" ADD CONSTRAINT "ForumTopic_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumTopic" ADD CONSTRAINT "ForumTopic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ForumCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumTopic" ADD CONSTRAINT "ForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumTopicWatch" ADD CONSTRAINT "UserForumTopicWatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumTopicWatch" ADD CONSTRAINT "UserForumTopicWatch_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumTopicFavorite" ADD CONSTRAINT "UserForumTopicFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserForumTopicFavorite" ADD CONSTRAINT "UserForumTopicFavorite_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumTopic" ADD CONSTRAINT "UpvoteForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteForumTopic" ADD CONSTRAINT "UpvoteForumTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumTopic" ADD CONSTRAINT "DownvoteForumTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteForumTopic" ADD CONSTRAINT "DownvoteForumTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumUserStats" ADD CONSTRAINT "ForumUserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ForumTagToForumTopic" ADD CONSTRAINT "_ForumTagToForumTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "ForumTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ForumTagToForumTopic" ADD CONSTRAINT "_ForumTagToForumTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "ForumTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
