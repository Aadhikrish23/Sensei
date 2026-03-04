import mongoose, { Document, Schema } from "mongoose";

export interface IAiMetadata extends Document {
  sessionId: string;
  questionNumber: number;

  // AI Model Info
  aiModel: string;
  promptVersion: string;
  temperature: number;

  // Token Usage
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;

  // Performance
  latencyMs: number;

  // Reliability
  isValidJson: boolean;
  retryCount: number;

  // Cost Tracking
  estimatedCostUsd: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const AiMetadataSchema = new Schema<IAiMetadata>(
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

    aiModel: {
      type: String,
      required: true,
    },

    promptVersion: {
      type: String,
      required: true,
    },

    temperature: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },

    inputTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    outputTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    totalTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    latencyMs: {
      type: Number,
      required: true,
      min: 0,
    },

    isValidJson: {
      type: Boolean,
      required: true,
    },

    retryCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    estimatedCostUsd: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate metadata per question per session
AiMetadataSchema.index(
  { sessionId: 1, questionNumber: 1 },
  { unique: true }
);

export const AiMetadataModel = mongoose.model<IAiMetadata>(
  "AiMetadata",
  AiMetadataSchema
);