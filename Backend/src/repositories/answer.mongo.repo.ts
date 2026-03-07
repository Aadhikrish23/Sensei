import { AnswerLogModel } from "../models/AnswerLog.js";

export type CreateAnswerInput = {
  sessionId: string;
  questionNumber: number;
  answerText: string;
  questionType: "THEORY" | "APPLIED";
  responseTimeSeconds?: number;
  editedCount?: number;
};

export async function createAnswer(data: CreateAnswerInput) {
  const answer = await AnswerLogModel.create({
    ...data,
    answerLength: data.answerText.length,
    submittedAt: new Date(),
  });

  return answer;
}