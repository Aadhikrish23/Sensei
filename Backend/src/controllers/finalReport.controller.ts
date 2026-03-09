import { NextFunction, Request, Response } from "express";
import finalReportService from "../services/finalReport.service.js";

export const createFinalReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.params.sessionId as string;

    const report = await finalReportService.generateFinalReport(sessionId);

    return res.json({
      status: "SUCCESS",
      data: report,
    });
  } catch (error) {
    console.error("Final Report Error:", error);

    next(error);
  }
};


export default {createFinalReport}