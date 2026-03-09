import {
  SessionSummaryInput,
  SessionSummaryOutput
} from  "../../types/sessionSummary.types.js";

function computeSessionSummary(
  input: SessionSummaryInput
): SessionSummaryOutput {

  const { evaluations, questions, skillGraph, jdSkills } = input

  const technicalAvg = avg(evaluations.map(e => e.technical))
  const depthAvg = avg(evaluations.map(e => e.depth))
  const communicationAvg = avg(evaluations.map(e => e.communication))
  const relevanceAvg = avg(evaluations.map(e => e.relevance))

  const codingScores = evaluations
    .map(e => e.codingScore)
    .filter(Boolean) as number[]

  const codingAvg = codingScores.length ? avg(codingScores) : 0

  const theoryQuestionCount =
    questions.filter(q => q.type === "THEORY").length

  const codingQuestionCount =
    questions.filter(q => q.type === "CODING").length

  const testedSkills = new Set<string>()

  questions.forEach(q => {
    q.skillTags.forEach(s => testedSkills.add(s))
  })

  const jdSkillSet = new Set(jdSkills)

  const covered = [...testedSkills].filter(skill =>
    jdSkillSet.has(skill)
  )

  const topicCoverageScore =
    jdSkills.length === 0 ? 0 : covered.length / jdSkills.length

  const scores = evaluations.map(
    e => (e.technical + e.depth + e.relevance) / 3
  )

  const mean = avg(scores)

  const variance =
    scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
    scores.length

  const stdDev = Math.sqrt(variance)

  const consistencyScore = Math.max(0, 10 - stdDev)

  const confidenceScore = skillGraph.length
    ? avg(skillGraph.map(s => s.confidence))
    : 0

  const strongSkillTags = skillGraph
    .filter(s => s.confidence > 0.75)
    .map(s => s.skill)

  const weakSkillTags = skillGraph
    .filter(s => s.confidence < 0.4)
    .map(s => s.skill)

  const overallScore =
    (
      technicalAvg * 0.3 +
      depthAvg * 0.2 +
      communicationAvg * 0.1 +
      codingAvg * 0.2 +
      relevanceAvg * 0.2
    ) * 10

  return {
    technicalAvg,
    depthAvg,
    communicationAvg,
    relevanceAvg,
    codingAvg,

    topicCoverageScore,
    consistencyScore,
    confidenceScore,

    overallScore,

    strongSkillTags,
    weakSkillTags,

    theoryQuestionCount,
    codingQuestionCount
  }
}

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export default {computeSessionSummary}