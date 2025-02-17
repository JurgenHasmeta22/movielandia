-- DropIndex
DROP INDEX "Message_senderId_receiverId_inboxId_key";

-- DropIndex
DROP INDEX "Notification_userId_senderId_key";

-- AlterTable
ALTER TABLE "Actor" ALTER COLUMN "fullname" SET DEFAULT 'Actor1',
ALTER COLUMN "debut" SET DEFAULT '01/01/1950',
ALTER COLUMN "description" SET DEFAULT 'Desc example';

-- AlterTable
ALTER TABLE "ActorReview" ALTER COLUMN "content" SET DEFAULT 'Content example';

-- AlterTable
ALTER TABLE "Crew" ALTER COLUMN "fullname" SET DEFAULT 'Crew1',
ALTER COLUMN "description" SET DEFAULT 'Desc example',
ALTER COLUMN "debut" SET DEFAULT '01/01/1990';

-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "title" SET DEFAULT 'Episode',
ALTER COLUMN "description" SET DEFAULT 'Episode description',
ALTER COLUMN "duration" SET DEFAULT 45,
ALTER COLUMN "ratingImdb" SET DEFAULT 1.0;

-- AlterTable
ALTER TABLE "Genre" ALTER COLUMN "name" SET DEFAULT 'Other';

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET DEFAULT 'Text example';

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "title" SET DEFAULT 'Movie',
ALTER COLUMN "ratingImdb" SET DEFAULT 1.0,
ALTER COLUMN "description" SET DEFAULT 'Movie desc',
ALTER COLUMN "duration" SET DEFAULT 120;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "title" SET DEFAULT 'Season',
ALTER COLUMN "ratingImdb" SET DEFAULT 1.0,
ALTER COLUMN "description" SET DEFAULT 'Season desc';

-- AlterTable
ALTER TABLE "Serie" ALTER COLUMN "title" SET DEFAULT 'Serie',
ALTER COLUMN "description" SET DEFAULT 'Serie desc',
ALTER COLUMN "ratingImdb" SET DEFAULT 1.0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET DEFAULT 'Bio example';
