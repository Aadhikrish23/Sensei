import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionLog extends Document {
  sessionId: string;
  questionNumber: number;
  questionText: string;
  questionType: "THEORY" | "APPLIED";
  difficulty: "easy"| "medium"|"hard";
  skillTags: string[];
  roleCategory: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionLogSchema = new Schema<IQuestionLog>(
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
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["THEORY" , "APPLIED"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    skillTags: {
      type: [String],
      required: true,
      default: [],
    },
    roleCategory: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index
QuestionLogSchema.index(
  { sessionId: 1, questionNumber: 1 },
  { unique: true }
);

export const QuestionLogModel = mongoose.model<IQuestionLog>(
  "QuestionLog",
  QuestionLogSchema
);