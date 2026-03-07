import questionMongoRepo from "../repositories/question.mongo.repo.js";

import prisma from "../lib/prisma.js";
import aiClient from "../lib/aiClient.js";
import { createAnswer } from "../repositories/answer.mongo.repo.js";
import { createEvaluation } from "../repositories/evaluation.mongo.repo.js";

async function createInterviewSession(
  userId: string,
  resumeId: string,
  jdId: string,
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
) {
  const resumeData = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
  });

  if (!resumeData) {
    throw new Error("Resume not found");
  }

  const jdData = await prisma.jobDescription.findFirst({
    where: {
      id: jdId,
      userId: userId,
    },
  });

  if (!jdData) {
    throw new Error("JD not found");
  }

  const roleCategory = jdData.roleCategory || "general";

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      resumeId,
      jdId,
      roleCategory,
      difficulty,
    },
  });

  const match = await prisma.resumeJDMatch.findUnique({
    where: {
      resumeId_jdId: {
        resumeId,
        jdId,
      },
    },
  });

  const aiPayload = {
    roleCategory,
    difficulty,
    resumeData: resumeData.parsedData,
    jdData: jdData.parsedData,
    matchAnalysis: {
      strongSkills: match?.strongSkills || [],
      missingSkills: match?.missingSkills || [],
      partiallyMatchedSkills: match?.partiallyMatchedSkills || [],
    },
    questionNumber: 1,
  };

  const response = await aiClient.post("/generate-question", aiPayload);

  if (!response.data || !response.data.question) {
    throw new Error("AI service failed to generate question");
  }
  const question = response.data.question;

  /* 8️⃣ Store Question in MongoDB */
  await questionMongoRepo.createQuestion({
    sessionId: session.id,
    questionNumber: 1,
    questionText: question.questionText,
    questionType: question.questionType,
    difficulty: question.difficulty,
    skillTags: question.skillTags,
    roleCategory: roleCategory,
  });

  /* 9️⃣ Update InterviewSession */
  await prisma.interviewSession.update({
    where: { id: session.id },
    data: {
      totalQuestions: 1,
    },
  });

  return {
    sessionId: session.id,
    questionNumber: 1,
    questionText: question.questionText,
    questionType: question.questionType,
    difficulty: question.difficulty,
    skillTags: question.skillTags,
  };
}

async function submitAnswer(
  userId: string,
  sessionId: string,
  questionNumber: number,
  answerText: string,
) {
  const session = await prisma.interviewSession.findFirst({
    where: {
      userId: userId,
      id: sessionId,
    },
  });
  if (!session) {
    throw new Error("Interview session not found");
  }

  if (session.completed) {
    throw new Error("Interview session already completed");
  }

  /* 2️⃣ Fetch question from Mongo */
  const question = await questionMongoRepo.getQuestion({
    sessionId,
    questionNumber,
  });

  if (!question) {
    throw new Error("Question not found");
  }

  await createAnswer({
    sessionId,
    questionNumber,
    answerText,
    questionType: question.questionType,
  });

   const resume = await prisma.resume.findUnique({
    where: { id: session.resumeId }
  });

  const jd = await prisma.jobDescription.findUnique({
    where: { id: session.jdId }
  });

  const aiPayload = {
    questionText: question.questionText,
    answerText: answerText,
    questionType: question.questionType,
    difficulty: question.difficulty,
    skillTags: question.skillTags,
    resumeContext: resume?.parsedData || {},
    jdContext: jd?.parsedData || {}
  };

    const response = await aiClient.post("/evaluate-answer", aiPayload);

  const evaluation = response.data.evaluation;
  const feedback = response.data.feedback;

   await createEvaluation({
    sessionId,
    questionNumber,

    technical: evaluation.technical,
    depth: evaluation.depth,
    communication: evaluation.communication,
    relevance: evaluation.relevance,

    strengths: feedback.strengths,
    weaknesses: feedback.weaknesses,
    improvements: feedback.improvements,

    skillTags: question.skillTags
  });

  return {
    evaluation,
    feedback
  };
}

export default { createInterviewSession , submitAnswer};
