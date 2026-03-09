import { Request, Response } from "express"
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

export default {completeInterviewSession}