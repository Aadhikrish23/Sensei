-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshExpires" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT;
