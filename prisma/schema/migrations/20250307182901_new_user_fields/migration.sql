-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "countryFrom" TEXT NOT NULL DEFAULT 'United States',
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'Male',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '+11234567890';

-- CreateIndex
CREATE INDEX "User_countryFrom_idx" ON "User"("countryFrom");
