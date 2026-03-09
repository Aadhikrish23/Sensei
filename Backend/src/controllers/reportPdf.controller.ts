import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { generateInterviewReportPDF } from "../services/reportPdf.service.js";

import { QuestionLogModel } from "../models/QuestionLog.js";
import { AnswerLogModel } from "../models/AnswerLog.js";
import { EvaluationLogModel } from "../models/EvaluationLog.js";

 const downloadInterviewReportPDF = async (
  req: Request,
  res: Response,
) => {
  const sessionId = req.params.sessionId as string;
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: { sessionSummary: true },
  });

  if (!session || !session.finalReport) {
    return res.status(404).json({ message: "Report not found" });
  }

  const questions = await QuestionLogModel.find({ sessionId });
  const answers = await AnswerLogModel.find({ sessionId });
  const evaluations = await EvaluationLogModel.find({ sessionId });

  const transcripts = questions.map((q, index) => ({
    question: (q as any).questionText,

    answer: (answers[index] as any)?.answerText || "",
    missing: (evaluations[index] as any)?.weaknesses || [],
  }));

  const pdf = await generateInterviewReportPDF(
    session.finalReport,
    session.sessionSummary,
    transcripts,
    sessionId,
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=sensei-report-${sessionId}.pdf`,
  );

  res.setHeader("Content-Type", "application/pdf");

  res.send(pdf);
};


export default {downloadInterviewReportPDF}