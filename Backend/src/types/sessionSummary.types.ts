export interface EvaluationLogInput {
  technical: number
  depth: number
  communication: number
  relevance: number
  codingScore?: number
  skillTags: string[]
}

export interface QuestionLogInput {
  type: "THEORY" | "CODING"
  skillTags: string[]
}

export interface SkillGraphNode {
  skill: string
  confidence: number
  scores: number[]
  questions_asked: number
}

export interface SessionSummaryInput {
  evaluations: EvaluationLogInput[]
  questions: QuestionLogInput[]
  skillGraph: SkillGraphNode[]
  jdSkills: string[]
}

export interface SessionSummaryOutput {
  technicalAvg: number
  depthAvg: number
  communicationAvg: number
  relevanceAvg: number
  codingAvg: number

  topicCoverageScore: number
  consistencyScore: number
  confidenceScore: number

  overallScore: number

  strongSkillTags: string[]
  weakSkillTags: string[]

  theoryQuestionCount: number
  codingQuestionCount: number
}