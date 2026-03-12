import { NextFunction, Request, Response } from "express";
import finalReportService from "../services/finalReport.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFinalReport = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
    const sessionId = req.params.sessionId as string;

    const report = await finalReportService.generateFinalReport(sessionId);

    return res.json({
      status: "SUCCESS",
      data: report,
    });
 
});


export default {createFinalReport}