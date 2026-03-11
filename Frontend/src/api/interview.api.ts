import apiClient from "./axios"
import {
  MatchResult,
  StartInterviewRequest,
  StartInterviewResponse,
  SubmitAnswerRequest,
  AnswerResponse,
  InterviewSession
} from "../types/interview.types"

const matchResumeJD = async (
  resumeId: string,
  jdId: string
): Promise<MatchResult> => {
  const response = await apiClient.post("/ai/match-resume-jd", {
    resumeId,
    jdId
  })

  return response.data
}

const startInterview = async (
  payload: StartInterviewRequest
): Promise<StartInterviewResponse> => {
  const response = await apiClient.post(
    "/interview/start-interview",
    payload
  )

  return response.data.Data
}

const submitAnswer = async (
  payload: SubmitAnswerRequest
): Promise<AnswerResponse> => {
  const response = await apiClient.post(
    "/interview/answer",
    payload
  )

  return response.data.data
}

const endInterview = async (sessionId: string) => {
  const response = await apiClient.post(
    `/interview/${sessionId}/end`
  )

  return response.data
}

const getSessions = async (): Promise<InterviewSession[]> => {
  const response = await apiClient.get("/interview")

  return response.data.data
}

const getSessionById = async (sessionId: string) => {
  const response = await apiClient.get(`/interview/${sessionId}`)

  return response.data.data
}
const completeSession = async (sessionId: string) => {
  const response = await apiClient.post(
    `/session-summary/interview/${sessionId}/complete`
  )

  return response.data
}

const generateFinalReport = async (sessionId: string) => {
  const response = await apiClient.post(
    `/report/${sessionId}/final-report`
  )

  return response.data
}

const downloadReportPDF = async (sessionId: string) => {
  const response = await apiClient.get(
    `/report/${sessionId}/final-report/pdf`,
    {
      responseType: "blob",
    }
  )

  return response.data
}

export default {
  matchResumeJD,
  startInterview,
  submitAnswer,
  endInterview,
  getSessions,
  getSessionById,
  completeSession,
  generateFinalReport,downloadReportPDF
}