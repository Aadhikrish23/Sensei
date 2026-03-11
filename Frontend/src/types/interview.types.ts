export interface InterviewSession {
  id: string
  resumeId: string
  jdId: string
  roleCategory: string
  decision?: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
  endedAt?: string | null

  finalReport?: any
  reportGeneratedAt?: string | null
}

export interface MatchResult {
  matchPercentage: number
  strongSkills: string[]
  missingSkills: string[]
  partiallyMatchedSkills: string[]
  improvementSuggestions: string[]
}

export interface StartInterviewRequest {
  resumeId: string
  jdId: string
  difficulty: "easy" | "medium" | "hard"
}

export interface StartInterviewResponse {
  sessionId: string
  questionNumber: number
  questionText: string
  questionType: string
  difficulty: string
  skillTags: string[]
}

export interface SubmitAnswerRequest {
  sessionId: string
  questionNumber: number
  answerText: string
}

export interface InterviewQuestion {
  questionNumber: number
  questionText: string
  questionType: string
  difficulty: string
  skillTags: string[]
}

export interface Evaluation {
  technical: number
  depth: number
  communication: number
  relevance: number
}

export interface AnswerResponse {
  evaluation: Evaluation
  feedback: {
    strengths: string[]
    weaknesses: string[]
    improvements: string[]
  }
  nextQuestion?: InterviewQuestion
  interviewComplete?: boolean
}