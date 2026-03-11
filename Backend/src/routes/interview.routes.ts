import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post(
  "/start-interview",
  authenticate,
  interviewController.startInterview,
);
interviewRouter.post(
  "/answer",
  authenticate,
  interviewController.submitInterviewAnswer,
);
interviewRouter.post(
  "/:sessionId/end",
  authenticate,
  interviewController.endInterview,
);
interviewRouter.get(
  "/",
  authenticate,
  interviewController.getAllSessions,
);
interviewRouter.get(
  "/:sessionId",
  authenticate,
  interviewController.getSessionByID,
);

export default interviewRouter;
