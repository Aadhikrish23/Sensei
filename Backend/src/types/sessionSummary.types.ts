export interface EvaluationRecord {
  technical: number
  depth: number
  communication: number
  relevance: number

  codingScore?: number

  skillTags: string[]

  strengths?: string[]
  weaknesses?: string[]
}

export interface QuestionRecord {
  type: "THEORY" | "APPLIED"

  skillTags: string[]

  difficulty?: "EASY" | "MEDIUM" | "HARD"
}


export interface SessionSummaryInput {
  evaluations: EvaluationRecord[]

  questions: QuestionRecord[]

  skillGraph: string[]
}

export interface SessionSummaryResult {
  technicalAvg: number
  depthAvg: number
  communicationAvg: number
  codingAvg: number
  relevanceAvg: number

  topicCoverageScore: number
  consistencyScore: number
  confidenceScore: number

  overallScore: number

  strongSkillTags: string[]
  weakSkillTags: string[]

  theoryQuestionCount: number
  codingQuestionCount: number
}

export interface SkillAnalysisResult {
  strong: string[]
  weak: string[]
}

export interface CategoryAverages {
  technicalAvg: number
  depthAvg: number
  communicationAvg: number
  codingAvg: number
  relevanceAvg: number
}