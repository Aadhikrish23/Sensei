import logger from "../utils/logger/logger.js";

type AIType =
  | "question_generation"
  | "evaluation"
  | "resume_analysis"
  | "other";

interface AIBaseLog {
  requestId: string;
  type: AIType;
}

interface AIRequestLog extends AIBaseLog {
  endpoint?: string; // 🔥 which AI endpoint we called
}

interface AIResponseLog extends AIBaseLog {
  duration: number;
  status?: number; // HTTP status
}

interface AIErrorLog extends AIBaseLog {
  error: string;
  stack?: string;
  status?: number;
}

// 🔥 helper to truncate large text (future-proof)
const truncate = (text?: string, maxLength = 500) => {
  if (!text) return text;
  return text.length > maxLength
    ? text.slice(0, maxLength) + "...[truncated]"
    : text;
};

export const aiLogger = {
  // 1️⃣ AI Request
  request: ({ requestId, type, endpoint }: AIRequestLog) => {
    logger.info({
      event: "AI_REQUEST",
      requestId,
      type,
      endpoint,
    });
  },

  // 2️⃣ AI Success
  response: ({ requestId, type, duration, status }: AIResponseLog) => {
    logger.info({
      event: "AI_RESPONSE",
      requestId,
      type,
      duration,
      status,
    });
  },

  // 3️⃣ AI Error
  error: ({ requestId, type, error, stack, status }: AIErrorLog) => {
    logger.error({
      event: "AI_ERROR",
      requestId,
      type,
      error,
      stack,
      status,
    });
  },
};