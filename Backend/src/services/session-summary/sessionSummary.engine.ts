import {
  SessionSummaryInput,
  SessionSummaryResult,
  EvaluationRecord,
  QuestionRecord,
  CategoryAverages,
  SkillAnalysisResult
} from "../../types/sessionSummary.types.js"


export function generateSessionSummary(
  input: SessionSummaryInput
): SessionSummaryResult {

  const { evaluations, questions, skillGraph } = input

  const averages = computeCategoryAverages(evaluations)

  const questionStats = computeQuestionStats(questions)

  const topicCoverage = computeTopicCoverage(
    questions,
    skillGraph
  )

  const skillAnalysis = computeSkillStrength(evaluations)

  const consistencyScore = computeConsistency(evaluations)

  const confidenceScore = computeConfidence(
    averages.communicationAvg,
    averages.depthAvg,
    consistencyScore
  )

  const overallScore = computeOverallScore(
    averages,
    topicCoverage
  )

  return {
    ...averages,

    topicCoverageScore: topicCoverage,
    consistencyScore,
    confidenceScore,

    overallScore,

    strongSkillTags: skillAnalysis.strong,
    weakSkillTags: skillAnalysis.weak,

    theoryQuestionCount: questionStats.theory,
    codingQuestionCount: questionStats.coding
  }

}


// --------------------------------------------------

function computeCategoryAverages(
  evaluations: EvaluationRecord[]
): CategoryAverages {

  if (evaluations.length === 0) {
    return {
      technicalAvg: 0,
      depthAvg: 0,
      communicationAvg: 0,
      codingAvg: 0,
      relevanceAvg: 0
    }
  }

  let technical = 0
  let depth = 0
  let communication = 0
  let relevance = 0

  let codingTotal = 0
  let codingCount = 0

  for (const e of evaluations) {

    technical += e.technical
    depth += e.depth
    communication += e.communication
    relevance += e.relevance

    if (e.codingScore !== undefined) {
      codingTotal += e.codingScore
      codingCount++
    }

  }

  return {
    technicalAvg: technical / evaluations.length,
    depthAvg: depth / evaluations.length,
    communicationAvg: communication / evaluations.length,
    relevanceAvg: relevance / evaluations.length,
    codingAvg: codingCount > 0 ? codingTotal / codingCount : 0
  }
}


// --------------------------------------------------

function computeQuestionStats(
  questions: QuestionRecord[]
) {

  let theory = 0
  let coding = 0

  for (const q of questions) {

    if (q.type === "THEORY") theory++

    if (q.type === "APPLIED") coding++

  }

  return {
    theory,
    coding
  }

}


// --------------------------------------------------

function computeTopicCoverage(
  questions: QuestionRecord[],
  skillGraph: string[]
): number {

  if (skillGraph.length === 0) return 0

  const coveredSkills = new Set<string>()

  for (const q of questions) {

    for (const skill of q.skillTags) {

      coveredSkills.add(skill)

    }

  }

  const matched = skillGraph.filter(skill =>
    coveredSkills.has(skill)
  )

  return matched.length / skillGraph.length

}


// --------------------------------------------------

function computeSkillStrength(
  evaluations: EvaluationRecord[]
): SkillAnalysisResult {

  const skillScores: Record<string, number[]> = {}

  for (const e of evaluations) {

    const score =
      (e.technical + e.depth + e.relevance) / 3

    for (const skill of e.skillTags) {

      if (!skillScores[skill]) {
        skillScores[skill] = []
      }

      skillScores[skill].push(score)

    }

  }

  const strong: string[] = []
  const weak: string[] = []

  for (const skill in skillScores) {

    const scores = skillScores[skill]

    const avg =
      scores.reduce((a, b) => a + b, 0) / scores.length

    if (avg >= 8) strong.push(skill)

    if (avg <= 5) weak.push(skill)

  }

  return {
    strong,
    weak
  }

}


// --------------------------------------------------

function computeConsistency(
  evaluations: EvaluationRecord[]
): number {

  if (evaluations.length === 0) return 0

  const scores = evaluations.map(e =>
    (e.technical + e.depth + e.relevance) / 3
  )

  const mean =
    scores.reduce((a, b) => a + b, 0) / scores.length

  const variance =
    scores.reduce((sum, val) =>
      sum + Math.pow(val - mean, 2), 0
    ) / scores.length

  const stdDev = Math.sqrt(variance)

  const consistency = Math.max(0, 10 - stdDev)

  return consistency

}


// --------------------------------------------------

function computeConfidence(
  communicationAvg: number,
  depthAvg: number,
  consistencyScore: number
): number {

  const confidence =
    (communicationAvg * 0.5) +
    (depthAvg * 0.3) +
    (consistencyScore * 0.2)

  return confidence

}


// --------------------------------------------------

function computeOverallScore(
  averages: CategoryAverages,
  topicCoverage: number
): number {

  const score =
    (averages.technicalAvg * 0.25) +
    (averages.depthAvg * 0.20) +
    (averages.codingAvg * 0.20) +
    (averages.communicationAvg * 0.15) +
    (averages.relevanceAvg * 0.10) +
    (topicCoverage * 10 * 0.10)

  return Math.round(score * 10)

}