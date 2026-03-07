import { Request, Response, NextFunction } from "express";
import interviewService from "../services/interview.service.js";

const startInterview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
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

  } catch (error) {
    next(error);
  }
};

async function submitInterviewAnswer(req: Request, res: Response) {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;

    const { sessionId, questionNumber, answerText } = req.body;

    if (!sessionId || !questionNumber || !answerText) {
      return res.status(400).json({
        status: "ERROR",
        message: "sessionId, questionNumber and answerText are required"
      });
    }

    const result = await interviewService.submitAnswer(
      userId,
      sessionId,
      questionNumber,
      answerText
    );

    return res.status(200).json({
      status: "SUCCESS",
      data: result
    });

  } catch (error: any) {

    return res.status(500).json({
      status: "ERROR",
      message: error.message
    });

  }
}
export default {startInterview,submitInterviewAnswer}