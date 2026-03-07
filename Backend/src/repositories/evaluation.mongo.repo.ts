import { EvaluationLogModel } from "../models/EvaluationLog.js";

export type CreateEvaluationInput = {
  sessionId: string;
  questionNumber: number;

  technical: number;
  depth: number;
  communication: number;
  relevance: number;

  strengths: string[];
  weaknesses: string[];
  improvements: string[];

  skillTags: string[];
};

export async function createEvaluation(data: CreateEvaluationInput) {
  const evaluation = await EvaluationLogModel.create(data);
  return evaluation;
}