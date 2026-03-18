import {  Request, Response } from "express";
import finalReportService from "../services/finalReport.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createFinalReport = asyncHandler(async (
  req: Request,
  res: Response,
 
) => {
  
    const sessionId = req.params.sessionId as string;

    const report = await finalReportService.generateFinalReport(sessionId,req.requestId);

    return res.json({
      status: "SUCCESS",
      data: report,
    });
 
});


export default {createFinalReport}