import aiClient from "../lib/aiClient.js";
import prisma from "../lib/prisma.js";
import { buildTopicMatrix } from "./topicMatrixBuilder.js";

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
  const response =await aiClient.post("/parse-resume",{
    rawText :Resume.extractedText
  });
  const parsedData = response.data;
  const topicMatrix = buildTopicMatrix(parsedData.topics||[]);
  const updatedResume = await prisma.resume.update({
    where: {
      id: resumeId,
    },
    data: {
      parsedData: parsedData,
      topicMatrix: topicMatrix,
    },
  });
  return updatedResume
}
export default { parseJobDescription ,parseResume };
