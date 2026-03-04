-- CreateEnum
CREATE TYPE "SessionDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ADAPTIVE');

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "extractedText" TEXT NOT NULL,
    "parsedData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobDescription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "parsedData" JSONB,
    "roleCategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jdId" TEXT NOT NULL,
    "roleCategory" TEXT NOT NULL,
    "difficulty" "SessionDifficulty" NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSummary" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "technicalAvg" DOUBLE PRECISION NOT NULL,
    "depthAvg" DOUBLE PRECISION NOT NULL,
    "communicationAvg" DOUBLE PRECISION NOT NULL,
    "codingAvg" DOUBLE PRECISION NOT NULL,
    "relevanceAvg" DOUBLE PRECISION NOT NULL,
    "topicCoverageScore" DOUBLE PRECISION NOT NULL,
    "consistencyScore" DOUBLE PRECISION NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "strongSkillTags" JSONB,
    "weakSkillTags" JSONB,
    "theoryQuestionCount" INTEGER NOT NULL,
    "codingQuestionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeJDMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jdId" TEXT NOT NULL,
    "matchPercentage" DOUBLE PRECISION NOT NULL,
    "strongSkills" JSONB,
    "missingSkills" JSONB,
    "partiallyMatchedSkills" JSONB,
    "improvementSuggestions" JSONB,
    "resumeVersionHash" TEXT NOT NULL,
    "jdVersionHash" TEXT NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeJDMatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "JobDescription_userId_idx" ON "JobDescription"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "InterviewSession_roleCategory_idx" ON "InterviewSession"("roleCategory");

-- CreateIndex
CREATE INDEX "InterviewSession_userId_roleCategory_idx" ON "InterviewSession"("userId", "roleCategory");

-- CreateIndex
CREATE INDEX "InterviewSession_completed_idx" ON "InterviewSession"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSummary_sessionId_key" ON "SessionSummary"("sessionId");

-- CreateIndex
CREATE INDEX "SessionSummary_overallScore_idx" ON "SessionSummary"("overallScore");

-- CreateIndex
CREATE INDEX "ResumeJDMatch_userId_idx" ON "ResumeJDMatch"("userId");

-- CreateIndex
CREATE INDEX "ResumeJDMatch_resumeVersionHash_idx" ON "ResumeJDMatch"("resumeVersionHash");

-- CreateIndex
CREATE INDEX "ResumeJDMatch_jdVersionHash_idx" ON "ResumeJDMatch"("jdVersionHash");

-- CreateIndex
CREATE UNIQUE INDEX "ResumeJDMatch_resumeId_jdId_key" ON "ResumeJDMatch"("resumeId", "jdId");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobDescription" ADD CONSTRAINT "JobDescription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_jdId_fkey" FOREIGN KEY ("jdId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSummary" ADD CONSTRAINT "SessionSummary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeJDMatch" ADD CONSTRAINT "ResumeJDMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeJDMatch" ADD CONSTRAINT "ResumeJDMatch_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeJDMatch" ADD CONSTRAINT "ResumeJDMatch_jdId_fkey" FOREIGN KEY ("jdId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
