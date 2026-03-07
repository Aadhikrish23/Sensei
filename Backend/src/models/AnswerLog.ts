import mongoose, { Document, Schema } from "mongoose";

export interface IAnswerLog extends Document {
  sessionId: string;
  questionNumber: number;

  answerText: string;
  answerLength: number;

  questionType: "THEORY" | "APPLIED";

  editedCount: number;
  responseTimeSeconds: number;

  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerLogSchema = new Schema<IAnswerLog>(
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

    answerText: {
      type: String,
      required: true,
    },

    answerLength: {
      type: Number,
      required: true,
    },

    questionType: {
      type: String,
      enum: ["THEORY", "APPLIED"],
      required: true,
    },

    editedCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    responseTimeSeconds: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    submittedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate answers per question per session
AnswerLogSchema.index(
  { sessionId: 1, questionNumber: 1 },
  { unique: true }
);

export const AnswerLogModel = mongoose.model<IAnswerLog>(
  "AnswerLog",
  AnswerLogSchema
);