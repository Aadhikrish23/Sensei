import { NextFunction, Request, Response } from "express"
import sessionSummaryService from "../services/session-summary/sessionSummary.service.js"
 const completeInterviewSession = async (
  req: Request,
  res: Response
) => {
  try {
    const sessionId = req.params.sessionId as string

    const summary = await sessionSummaryService.generateSessionSummary(sessionId)

    return res.status(200).json({
      status: "SUCCESS",
      data: summary
    })
  } catch (error: any) {
    return res.status(500).json({
      status: "ERROR",
      message: error.message
    })
  }
}

const getAllSessions = async (req:Request,res:Response,next:NextFunction) => {
  
   
    try {
if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const session = await sessionSummaryService.getAllSession(req.user.id);

      return res.status(200).json({
      data: session,
    });
    } catch (error) {
      next(error)
    }
}
export default {completeInterviewSession,getAllSessions}