/*
  Warnings:

  - You are about to drop the column `difficulty` on the `InterviewSession` table. All the data in the column will be lost.
  - You are about to drop the column `durationSeconds` on the `InterviewSession` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `InterviewSession` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `InterviewSession` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `InterviewSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "InterviewSession_completed_idx";

-- DropIndex
DROP INDEX "InterviewSession_roleCategory_idx";

-- DropIndex
DROP INDEX "InterviewSession_userId_idx";

-- DropIndex
DROP INDEX "InterviewSession_userId_roleCategory_idx";

-- AlterTable
ALTER TABLE "InterviewSession" DROP COLUMN "difficulty",
DROP COLUMN "durationSeconds",
DROP COLUMN "endedAt",
DROP COLUMN "startedAt",
ADD COLUMN     "decision" TEXT,
ADD COLUMN     "skillGraph" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
