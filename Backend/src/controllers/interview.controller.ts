import { Request, Response } from "express";
import interviewService from "../services/interview.service.js";
import sessionSummaryService from "../services/session-summary/sessionSummary.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const startInterview = asyncHandler(async (
  req: Request,
  res: Response,
 
) => {
  
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }
    const userId = req.user.id;
    const { resumeId, jdId, difficulty } = req.body;

    const sessionData = await interviewService.createInterviewSession(
      userId,
      resumeId,
      jdId,
      difficulty,
    );

    return res.status(201).json({
      Status: "Success",
      Data: sessionData,
    });
  
});

const submitInterviewAnswer =asyncHandler (async (
  req: Request,
  res: Response,
 
) => {

    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }
    const userId = req.user.id;

    const { sessionId, questionNumber, answerText } = req.body;

    if (!sessionId || !questionNumber || !answerText) {
     throw new AppError( "sessionId, questionNumber and answerText are required",401);
    }

    const result = await interviewService.submitAnswer(
      userId,
      sessionId,
      questionNumber,
      answerText,
    );

    return res.status(200).json({
      status: "SUCCESS",
      data: result,
    });
 
});

const endInterview =asyncHandler( async (
  req: Request,
  res: Response,
 
) => {
 
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }

    const userId = req.user.id;
    const sessionId = req.params.sessionId as string;

    await interviewService.endInterviewSession(userId, sessionId);

    const summary =
      await sessionSummaryService.generateSessionSummary(sessionId);

    return res.json({
      status: "SUCCESS",
      message: "Interview ended",
      summary,
    });
  
});
const getAllSessions =asyncHandler(async (
  req: Request,
  res: Response,
 
) => {
  
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }

    const session = await interviewService.getAllSession(req.user.id);

    return res.status(200).json({
      data: session,
    });
  
});
const getSessionByID = asyncHandler(async (
  req: Request,
  res: Response,
 
) => {
  
    if (!req.user) {
      throw new AppError( "Unauthorized" ,401);
    }
     const sessionId = req.params.sessionId as string;


    const session = await interviewService.getSessionById(req.user.id,sessionId);

    return res.status(200).json({
      data: session,
    });
  
});
export default {
  startInterview,
  submitInterviewAnswer,
  endInterview,
  getAllSessions,
  getSessionByID
};
