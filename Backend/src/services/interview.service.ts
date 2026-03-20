import questionMongoRepo from "../repositories/question.mongo.repo.js";

import prisma from "../lib/prisma.js";
import aiClient from "../lib/aiClient.js";
import { INTERVIEW_CONFIG } from "../config/interview.config.js";
import { EvaluationLogModel } from "../models/EvaluationLog.js";

import { createAnswer } from "../repositories/answer.mongo.repo.js";
import { createEvaluation } from "../repositories/evaluation.mongo.repo.js";
import { AppError } from "../utils/AppError.js";

async function createInterviewSession(
  userId: string,
  resumeId: string,
  jdId: string,
  difficulty: "easy" | "medium" | "hard",
  requestId: string
) {
  const resumeData = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resumeData) {
 throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");  }

  const jdData = await prisma.jobDescription.findFirst({
    where: { id: jdId, userId },
  });

  if (!jdData) {
  throw new AppError("Job description not found", 404, "JD_NOT_FOUND");
  }

  if (!resumeData.parsedData) {
  throw new AppError(
    "Resume not analyzed yet",
    400,
    "RESUME_NOT_PARSED"
  );
}

if (!jdData.parsedData) {
  throw new AppError(
    "Job description not parsed yet",
    400,
    "JD_NOT_PARSED"
  );
}
  const existingSession = await prisma.interviewSession.findFirst({
    where: {
      userId,
      resumeId,
      jdId,
      completed: false,
    },
  });

  if (existingSession) {
    throw new AppError(
      "An active interview already exists for this Resume and JD",400,"INTERVIEW-EXISTS"
    );
  }

  const roleCategory = jdData.roleCategory || "general";

  const match = await prisma.resumeJDMatch.findUnique({
    where: {
      resumeId_jdId: { resumeId, jdId },
    },
  });

  const strongSkills = (match?.strongSkills as string[]) || [];
  const missingSkills = (match?.missingSkills as string[]) || [];
  const partialSkills = (match?.partiallyMatchedSkills as string[]) || [];

  const allSkills = [...strongSkills, ...missingSkills, ...partialSkills];

  const skillGraph: any = {};

  allSkills.forEach((skill) => {
    skillGraph[skill] = {
      scores: [],
      confidence: 0,
      questions_asked: 0,
    };
  });

  /* Generate first question BEFORE creating session */

  const aiPayload = {
    roleCategory,
    difficulty,
    resumeData: resumeData.parsedData,
    jdData: jdData.parsedData,
    matchAnalysis: {
      strongSkills,
      missingSkills,
      partiallyMatchedSkills: partialSkills,
    },
    questionNumber: 1,
  };

const response = await aiClient.post(
  "/generate-question",
  aiPayload,
  {
    headers: {
      "x-request-id": requestId,
      "x-ai-type": "question_generation",
    },
  }
);
  if (!response.data || !response.data.question) {
    throw new Error("AI service failed to generate question");
  }

  const question = response.data.question;

  /* Now create session */

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      resumeId,
      jdId,
      roleCategory,
      difficulty,
      skillGraph,
      totalQuestions: 1,
    },
  });

  /* Store question */

  await questionMongoRepo.createQuestion({
    sessionId: session.id,
    questionNumber: 1,
    questionText: question.questionText,
    questionType: question.questionType,
    difficulty: question.difficulty,
    skillTags: question.skillTags,
    roleCategory,
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
  requestId: string
) {
  const session = await prisma.interviewSession.findFirst({
    where: {
      userId: userId,
      id: sessionId,
    },
  });

  if (!session) {
  throw new AppError(
    "Interview session not found",
    404,
    "SESSION_NOT_FOUND"
  );
}

  if (session.completed) {
 throw new AppError(
    "Interview already completed",
    400,
    "SESSION_COMPLETED"
  );  }

  const question = await questionMongoRepo.getQuestion({
    sessionId,
    questionNumber,
  });

  if (!question) {
throw new AppError(
    "Question not found",
    404,
    "QUESTION_NOT_FOUND"
  );  }

  const resume = await prisma.resume.findUnique({
    where: { id: session.resumeId },
  });

  const jd = await prisma.jobDescription.findUnique({
    where: { id: session.jdId },
  });

  if (!resume?.parsedData || !jd?.parsedData) {
  throw new AppError(
    "Resume or JD not parsed yet",
    400,
    "DATA_NOT_READY"
  );
}
  const aiPayload = {
    questionText: question.questionText,
    answerText: answerText,
    questionType: question.questionType,
    difficulty: question.difficulty,
    skillTags: question.skillTags,
    resumeContext: resume?.parsedData || {},
    jdContext: jd?.parsedData || {},
  };

  /* ---------- AI Evaluation ---------- */

const response = await aiClient.post(
  "/evaluate-answer",
  aiPayload,
  {
    headers: {
      "x-request-id": requestId,
      "x-ai-type": "evaluation",
    },
  }
);
  const evaluation = response.data.evaluation;
  const feedback = response.data.feedback;

  const evaluationScore =
    (evaluation.technical +
      evaluation.depth +
      evaluation.communication +
      evaluation.relevance) /
    4;

  const history = await questionMongoRepo.getSessionQuestions(sessionId);

  if (session.totalQuestions >= INTERVIEW_CONFIG.MAX_QUESTIONS) {
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
      },
    });

    return {
      evaluation,
      feedback,
      interviewComplete: true,
      reason: "MAX_QUESTIONS_REACHED",
    };
  }

  /* ---------- LOW SCORE STREAK CHECK ---------- */

  const recentEvaluations = await EvaluationLogModel.find({ sessionId })
    .sort({ questionNumber: -1 })
    .limit(INTERVIEW_CONFIG.LOW_SCORE_STREAK_LIMIT);

  if (recentEvaluations.length === INTERVIEW_CONFIG.LOW_SCORE_STREAK_LIMIT) {
    const lowScores = recentEvaluations.filter((e) => {
      const avg = (e.technical + e.depth + e.relevance) / 3;

      return avg < INTERVIEW_CONFIG.LOW_SCORE_THRESHOLD;
    });

    if (lowScores.length === INTERVIEW_CONFIG.LOW_SCORE_STREAK_LIMIT) {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          completed: true,
        },
      });

      return {
        evaluation,
        feedback,
        interviewComplete: true,
        reason: "LOW_SCORE_STREAK",
      };
    }
  }

  /* ---------- SKILL COVERAGE CHECK ---------- */

  const testedSkills = await questionMongoRepo.getSessionQuestions(sessionId);

  const skillSet = new Set<string>();

  testedSkills.forEach((q: any) => {
    q.skillTags.forEach((s: string) => skillSet.add(s));
  });

  const jdParsed = jd?.parsedData as any;
  const jdSkills: string[] = jdParsed?.skills || [];

  let coverage = 0;

  if (jdSkills.length > 0) {
    coverage = skillSet.size / jdSkills.length;
  }

  if (coverage >= INTERVIEW_CONFIG.TARGET_SKILL_COVERAGE) {
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
      },
    });

    return {
      evaluation,
      feedback,
      interviewComplete: true,
      reason: "SKILL_COVERAGE_COMPLETE",
    };
  }

  const match = await prisma.resumeJDMatch.findUnique({
    where: {
      resumeId_jdId: {
        resumeId: session.resumeId,
        jdId: session.jdId,
      },
    },
  });

  const nextPayload = {
    resume_data: resume?.parsedData || {},
    jd_data: jd?.parsedData || {},

    match_result: {
      strongSkills: match?.strongSkills || [],
      missingSkills: match?.missingSkills || [],
    },

    previous_question: question.questionText,

    user_answer: answerText,

    evaluation_score: evaluationScore,

    skill_tags: question.skillTags,

    skill_graph: session.skillGraph || {},

    interview_history: history,
  };

  /* ---------- Generate Next Question ---------- */

  const next = await generateNextQuestion(nextPayload,requestId);

  /* ---------- NOW write to DB ---------- */

  await createAnswer({
    sessionId,
    questionNumber,
    answerText,
    questionType: question.questionType,
  });

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

    skillTags: question.skillTags,
  });

  if (next.interview_complete) {
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        decision: next.decision,
        skillGraph: next.skill_graph,
      },
    });

    return {
      evaluation,
      feedback,
      interviewComplete: true,
      decision: next.decision,
    };
  }

  const nextQuestion = next.question;
  const nextQuestionNumber = questionNumber + 1;

  await questionMongoRepo.createQuestion({
    sessionId,
    questionNumber: nextQuestionNumber,
    questionText: nextQuestion.questionText,
    questionType: nextQuestion.questionType,
    difficulty: nextQuestion.difficulty,
    skillTags: nextQuestion.skillTags,
    roleCategory: session.roleCategory,
  });

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      skillGraph: next.skill_graph,
      totalQuestions: nextQuestionNumber,
    },
  });

  return {
    evaluation,
    feedback,

    nextQuestion: {
      questionNumber: nextQuestionNumber,
      questionText: nextQuestion.questionText,
      questionType: nextQuestion.questionType,
      difficulty: nextQuestion.difficulty,
      skillTags: nextQuestion.skillTags,
    },
  };
}

async function generateNextQuestion(payload: any, requestId: string) {
  const response = await aiClient.post(
  "/generate-next-question",
  payload,
  {
    headers: {
      "x-request-id": requestId,
      "x-ai-type": "question_generation",
    },
  }
);

  return response.data;
}

async function endInterviewSession(userId: string, sessionId: string) {
  const session = await prisma.interviewSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
 throw new AppError(
    "Interview session not found",
    404,
    "SESSION_NOT_FOUND"
  );  }

  if (session.completed) {
throw new AppError(
    "Interview already completed",
    400,
    "SESSION_COMPLETED"
  );  }

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      completed: true,
    },
  });

  return {
    message: "Interview ended successfully",
  };
}

async function getAllSession(userid: string) {
  const session = await prisma.interviewSession.findMany({
    where: {
      userId: userid,
    },
    select: {
      id: true,
      userId: true,
      resumeId: true,
      jdId: true,
      roleCategory: true,
      decision: true,
      completed: true,
      createdAt: true,
      updatedAt: true,
      endedAt: true,
    },
  });

 
  return session;
}
async function getSessionById(userid: string, sessionId: string) {
  const session = await prisma.interviewSession.findFirst({
    where: {
      userId: userid,
      id: sessionId,
    },
    select: {
      id: true,
      userId: true,
      resumeId: true,
      jdId: true,
      roleCategory: true,
      decision: true,
      completed: true,
      createdAt: true,
      updatedAt: true,
      endedAt: true,
    },
  });
  const latestQuestion = await questionMongoRepo.getLatestQuestion(sessionId);
  if (!session) {
throw new AppError(
    "Interview session not found",
    404,
    "SESSION_NOT_FOUND"
  );  }
  return { session, question: latestQuestion };
}
export default {
  createInterviewSession,
  submitAnswer,
  generateNextQuestion,
  endInterviewSession,
  getAllSession,
  getSessionById,
};
