import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import sessionSummaryController from "../controllers/sessionSummary.controller.js";

const sessionSummaryRouter = express.Router();

sessionSummaryRouter.post(
  "/interview/:sessionId/complete",
  authenticate,
  sessionSummaryController.generateSessionSummary
);

export default sessionSummaryRouter;