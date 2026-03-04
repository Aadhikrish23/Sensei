import express from "express";
import multer from "../lib/multer.js";
import resumeController from "../controllers/resume.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const resumeRouter = express.Router();

resumeRouter.post(
  "/upload",
  authenticate,
  multer,
  resumeController.uploadResume,
);
resumeRouter.delete(
  "/:id",
  authenticate,
  resumeController.deleteResume,
);
resumeRouter.get(
  "/",
  authenticate,
  resumeController.getResumes
);
resumeRouter.get(
  "/:id",
  authenticate,
  resumeController.getResumeById
);
resumeRouter.patch(
  "/:id",
  authenticate,
  resumeController.renameResume
);

export default resumeRouter;
