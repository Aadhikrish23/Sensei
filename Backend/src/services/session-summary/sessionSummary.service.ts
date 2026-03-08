import prisma from "../../lib/prisma.js"

import { EvaluationLogModel } from "../../models/EvaluationLog.js"
import { QuestionLogModel } from "../../models/QuestionLog.js"

import { Prisma } from "@prisma/client"

import {
  SessionSummaryInput
} from "../../types/sessionSummary.types.js"

import {
  generateSessionSummary
} from "./sessionSummary.engine.js"


export async function generateSessionSummaryForSession(
  sessionId: string
) {

  // 1️⃣ Fetch interview session

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId }
  })

  if (!session) {
    throw new Error("Interview session not found")
  }


  // 2️⃣ Fetch evaluation logs

  const evaluationLogs = await EvaluationLogModel.find({
    sessionId
  }).lean()


  // 3️⃣ Fetch question logs

  const questionLogs = await QuestionLogModel.find({
    sessionId
  }).lean()


  // 4️⃣ Map evaluations → engine format

  const evaluations = evaluationLogs.map((e: any) => ({
    technical: e.technical ?? 0,
    depth: e.depth ?? 0,
    communication: e.communication ?? 0,
    relevance: e.relevance ?? 0,

    codingScore: e.codeCorrectness ?? undefined,

    skillTags: e.skillTags ?? [],

    strengths: e.strengths ?? [],
    weaknesses: e.weaknesses ?? []
  }))


  // 5️⃣ Map questions → engine format

  const questions = questionLogs.map((q: any) => ({
    type: q.questionType as "THEORY" | "APPLIED",
    skillTags: q.skillTags ?? []
  }))


  // 6️⃣ Build engine input

  const engineInput: SessionSummaryInput = {
    evaluations,
    questions,
    skillGraph: (session.skillGraph ?? []) as string[]
  }


  // 7️⃣ Run summary engine

  const summaryResult = generateSessionSummary(engineInput)


  // 8️⃣ Insert session summary

  const summary = await prisma.sessionSummary.create({

    data: {

      sessionId,

      technicalAvg: summaryResult.technicalAvg,
      depthAvg: summaryResult.depthAvg,
      communicationAvg: summaryResult.communicationAvg,
      codingAvg: summaryResult.codingAvg,
      relevanceAvg: summaryResult.relevanceAvg,

      topicCoverageScore: summaryResult.topicCoverageScore,
      consistencyScore: summaryResult.consistencyScore,
      confidenceScore: summaryResult.confidenceScore,

      overallScore: summaryResult.overallScore,

      strongSkillTags: summaryResult.strongSkillTags as Prisma.JsonArray,
      weakSkillTags: summaryResult.weakSkillTags as Prisma.JsonArray,

      theoryQuestionCount: summaryResult.theoryQuestionCount,
      codingQuestionCount: summaryResult.codingQuestionCount

    }

  })


  // 9️⃣ Mark interview completed

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      completed: true
    }
  })


  return summary
}