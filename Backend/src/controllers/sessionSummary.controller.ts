import { Request, Response } from "express";
import sessionSummaryService from "../services/session-summary/sessionSummary.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import interviewService from "../services/interview.service.js";
const completeInterviewSession = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    const summary =
      await sessionSummaryService.generateSessionSummary(sessionId);

    return res.status(200).json({
      status: "SUCCESS",
      data: summary,
    });
  },
);
const allsessions = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const summary = await interviewService.getAllSession;
  return res.status(200).json({
    status: "SUCCESS",
    data: summary,
  });
});

export default { completeInterviewSession,allsessions };
