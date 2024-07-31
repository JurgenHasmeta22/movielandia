-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "debut" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photoSrc" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photoSrcProd" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "UserActorRating" (
    "id" SERIAL NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "UserActorRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActorFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "UserActorFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActorReview" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,

    CONSTRAINT "ActorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpvoteActorReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "actorReviewId" INTEGER NOT NULL,

    CONSTRAINT "UpvoteActorReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownvoteActorReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "actorReviewId" INTEGER NOT NULL,

    CONSTRAINT "DownvoteActorReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserActorRating" ADD CONSTRAINT "UserActorRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActorRating" ADD CONSTRAINT "UserActorRating_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActorFavorite" ADD CONSTRAINT "UserActorFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActorFavorite" ADD CONSTRAINT "UserActorFavorite_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorReview" ADD CONSTRAINT "ActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActorReview" ADD CONSTRAINT "ActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteActorReview" ADD CONSTRAINT "UpvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteActorReview" ADD CONSTRAINT "UpvoteActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpvoteActorReview" ADD CONSTRAINT "UpvoteActorReview_actorReviewId_fkey" FOREIGN KEY ("actorReviewId") REFERENCES "ActorReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteActorReview" ADD CONSTRAINT "DownvoteActorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteActorReview" ADD CONSTRAINT "DownvoteActorReview_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownvoteActorReview" ADD CONSTRAINT "DownvoteActorReview_actorReviewId_fkey" FOREIGN KEY ("actorReviewId") REFERENCES "ActorReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
