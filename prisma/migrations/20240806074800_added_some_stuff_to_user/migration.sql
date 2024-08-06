-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Avatar" (
    "id" SERIAL NOT NULL,
    "photoSrc" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInbox" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "inboxId" INTEGER NOT NULL,

    CONSTRAINT "UserInbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inbox" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER,
    "inboxId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "Avatar"("userId");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInbox" ADD CONSTRAINT "UserInbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInbox" ADD CONSTRAINT "UserInbox_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_inboxId_fkey" FOREIGN KEY ("inboxId") REFERENCES "Inbox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
