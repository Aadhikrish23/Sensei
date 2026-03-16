import aiClient from "../lib/aiClient.js";
import prisma from "../lib/prisma.js";
import crypto from "crypto";
import { buildTopicMatrix } from "./topicMatrixBuilder.js";
import resumeService from "./resume.service.js";

async function parseJobDescription(jdId: string, userId: string) {
  // 1️⃣ Get JD from DB
  const jd = await prisma.jobDescription.findFirst({
    where: {
      id: jdId,
      userId: userId,
    },
  });

  if (!jd) {
    throw new Error("JD not found");
  }

  if (jd.parsedData) {
    return {
      parsedData: jd.parsedData,
    };
  }

  // 2️⃣ Call FastAPI AI service
  const response = await aiClient.post("/parse-jd", {
    rawText: jd.rawText,
  });

  const parsedData = response.data;
  const topicMatrix = buildTopicMatrix(parsedData.topics || []);

  // 3️⃣ Update JD with parsed data
  const updatedJD = await prisma.jobDescription.update({
    where: {
      id: jdId,
    },
    data: {
      parsedData: parsedData,
      roleCategory: parsedData.role || jd.roleCategory,
      topicMatrix: topicMatrix,
    },
  });

  return updatedJD;
}

async function parseResume(resumeId: string, userId: string) {
  const Resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
  });

  if (!Resume) {
    throw new Error("JD not found");
  }

  if (Resume.parsedData) {
    return {
      parsedData: Resume.parsedData,
    };
  }
  const response = await aiClient.post("/parse-resume", {
    rawText: Resume.extractedText,
  });
  const parsedData = response.data;

  if (!parsedData.name && !parsedData.email && !parsedData.phone) {
    const data = await resumeService.deleteResumeService(resumeId, userId);
    throw new Error("Uploaded file is not a valid resume.");
  }

  const topicMatrix = buildTopicMatrix(parsedData.topics || []);
  const updatedResume = await prisma.resume.update({
    where: {
      id: resumeId,
    },
    data: {
      parsedData: parsedData,
      topicMatrix: topicMatrix,
    },
  });
  return updatedResume;
}

async function match_jd_resume(resumeId: string, jdId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  // 2️⃣ Fetch job description
  const jd = await prisma.jobDescription.findFirst({
    where: {
      id: jdId,
      userId: userId,
    },
  });

  if (!jd) {
    throw new Error("Job description not found");
  }

  if (!resume.parsedData || !jd.parsedData) {
    throw new Error("Resume or JD not parsed yet");
  }

  const resumeVersionHash = generateHash(resume.parsedData);
  const jdVersionHash = generateHash(jd.parsedData);

  const existingMatch = await prisma.resumeJDMatch.findFirst({
    where: {
      resumeId,
      jdId,
      resumeVersionHash,
      jdVersionHash,
    },
  });
  if (existingMatch) {
    return existingMatch;
  }

  const aiResponse = await aiClient.post("/match-resume-jd", {
    resume_data: resume.parsedData,
    jd_data: jd.parsedData,
  });

  const aiResult = aiResponse.data;

  const strongSkills = aiResult.strongSkills || [];
  const missingSkills = aiResult.missingSkills || [];

  const partiallyMatchedSkills = aiResult.partiallyMatchedSkills || [];

  const improvementSuggestions =
    aiResult.improvement_suggestions || aiResult.improvementSuggestions || [];

  const matchPercentage = aiResult.matchPercentage || 0;

  // 5️⃣ Save Match Result
  const matchResult = await prisma.resumeJDMatch.upsert({
    where: {
      resumeId_jdId: {
        resumeId: resumeId,
        jdId: jdId,
      },
    },
    update: {
      matchPercentage,
      strongSkills,
      missingSkills,
      partiallyMatchedSkills,
      improvementSuggestions,
      resumeVersionHash,
      jdVersionHash,
      analyzedAt: new Date(),
    },
    create: {
      userId,
      resumeId,
      jdId,
      matchPercentage,
      strongSkills,
      missingSkills,
      partiallyMatchedSkills,
      improvementSuggestions,
      resumeVersionHash,
      jdVersionHash,
    },
  });
  return matchResult;
}

export default { parseJobDescription, parseResume, match_jd_resume };

function generateHash(data: any) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}
