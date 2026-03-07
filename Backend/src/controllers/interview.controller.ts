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

export default {startInterview}