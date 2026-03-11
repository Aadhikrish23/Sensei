import prisma from "../../lib/prisma.js";
import { EvaluationLogModel } from "../../models/EvaluationLog.js";
import { QuestionLogModel } from "../../models/QuestionLog.js";


import sessionSummaryEngine from "./sessionSummary.engine.js";
import { SessionSummaryInput } from "../../types/sessionSummary.types.js";
 const generateSessionSummary = async (sessionId: string) => {

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      sessionSummary: true,
      jobDescription: true
    }
  })

  if (!session) {
    throw new Error("Interview session not found")
  }

  if (session.sessionSummary) {
    throw new Error("Session summary already generated")
  }

  // Fetch Mongo logs
  const evaluationLogs = await EvaluationLogModel.find({ sessionId }).lean()
  const questionLogs = await QuestionLogModel.find({ sessionId }).lean()

  if (!evaluationLogs.length) {
    throw new Error("No evaluation logs found")
  }

  const evaluations = evaluationLogs.map((e: any) => ({
    technical: e.technical,
    depth: e.depth,
    communication: e.communication,
    relevance: e.relevance,
    codingScore: e.codeCorrectness,
    skillTags: e.skillTags ?? []
  }))

  const questions = questionLogs.map((q: any) => ({
    type: q.questionType,
    skillTags: q.skillTags ?? []
  }))

  const skillGraph = Object.entries(session.skillGraph ?? {}).map(
    ([skill, data]: any) => ({
      skill,
      confidence: data.confidence,
      scores: data.scores,
      questions_asked: data.questions_asked
    })
  )

  const jdParsed = session.jobDescription.parsedData as any

const jdSkills: string[] = jdParsed?.skills ?? []

  const engineInput: SessionSummaryInput = {
    evaluations,
    questions,
    skillGraph,
    jdSkills
  }

  const summary = sessionSummaryEngine.computeSessionSummary(engineInput)

  const savedSummary = await prisma.sessionSummary.create({
    data: {
      sessionId,

      technicalAvg: summary.technicalAvg,
      depthAvg: summary.depthAvg,
      communicationAvg: summary.communicationAvg,
      relevanceAvg: summary.relevanceAvg,
      codingAvg: summary.codingAvg,

      topicCoverageScore: summary.topicCoverageScore,
      consistencyScore: summary.consistencyScore,
      confidenceScore: summary.confidenceScore,

      overallScore: summary.overallScore,

      strongSkillTags: summary.strongSkillTags,
      weakSkillTags: summary.weakSkillTags,

      theoryQuestionCount: summary.theoryQuestionCount,
      codingQuestionCount: summary.codingQuestionCount
    }
  })

  const durationSeconds =
Math.floor((Date.now() - session.createdAt.getTime()) / 1000)

  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      completed: true,
      endedAt: new Date(),
      durationSeconds
    }
  })

  return savedSummary
}



export default {generateSessionSummary}