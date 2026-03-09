import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import finalReportController from "../controllers/finalReport.controller.js";
import reportPdfController from "../controllers/reportPdf.controller.js";

const reportRouter = express.Router();

reportRouter.post("/:sessionId/final-report",authenticate,finalReportController.createFinalReport);

reportRouter.get("/:sessionId/final-report/pdf",authenticate,reportPdfController.downloadInterviewReportPDF);

export default reportRouter;