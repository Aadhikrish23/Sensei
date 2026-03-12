import { NextFunction, Request, Response } from "express"
import sessionSummaryService from "../services/session-summary/sessionSummary.service.js"
import { asyncHandler } from "../utils/asyncHandler.js"
 const completeInterviewSession = asyncHandler(async (
  req: Request,
  res: Response
) => {
 
    const sessionId = req.params.sessionId as string

    const summary = await sessionSummaryService.generateSessionSummary(sessionId)

    return res.status(200).json({
      status: "SUCCESS",
      data: summary
    })
 
}
)

export default {completeInterviewSession}