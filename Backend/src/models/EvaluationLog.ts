import mongoose, { Document, Schema } from "mongoose";

export interface IEvaluationLog extends Document {
  sessionId: string;
  questionNumber: number;

  // Core Scoring (0–10 scale)
  technical: number;
  depth: number;
  communication: number;
  relevance: number;

  // Coding Evaluation (Only if APPLIED and coding-type)
  codeCorrectness?: number;
  timeComplexityScore?: number;
  structureScore?: number;
  edgeCaseHandling?: number;

  // Intelligence Insights
  strengths: string[];
  weaknesses: string[];
  improvements: string[];

  skillTags: string[];

  evaluatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationLogSchema = new Schema<IEvaluationLog>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    questionNumber: {
      type: Number,
      required: true,
    },

    // Core scoring fields
    technical: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    depth: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    communication: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    relevance: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    // Coding-specific (optional)
    codeCorrectness: {
      type: Number,
      min: 0,
      max: 10,
    },
    timeComplexityScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    structureScore: {
      type: Number,
      min: 0,
      max: 10,
    },
    edgeCaseHandling: {
      type: Number,
      min: 0,
      max: 10,
    },

    strengths: {
      type: [String],
      required: true,
      default: [],
    },
    weaknesses: {
      type: [String],
      required: true,
      default: [],
    },
    improvements: {
      type: [String],
      required: true,
      default: [],
    },

    skillTags: {
      type: [String],
      required: true,
      default: [],
    },

    evaluatedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate evaluation per question per session
EvaluationLogSchema.index(
  { sessionId: 1, questionNumber: 1 },
  { unique: true }
);

export const EvaluationLogModel = mongoose.model<IEvaluationLog>(
  "EvaluationLog",
  EvaluationLogSchema
);