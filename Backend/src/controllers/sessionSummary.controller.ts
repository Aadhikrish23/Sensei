import { Request, Response, NextFunction } from "express";

import { generateSessionSummaryForSession } 
from "../services/session-summary/sessionSummary.service.js";


const generateSessionSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const { sessionId } = req.params;

    if (!sessionId || typeof(sessionId) != "string")  {
      throw new Error("Session ID is required");
    }

    const summary = await generateSessionSummaryForSession(sessionId);

    return res.status(200).json({
      Status: "SUCCESS",
      Data: summary
    });

  } catch (error) {

    next(error);

  }

};


export default { generateSessionSummary };