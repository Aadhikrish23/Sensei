import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import aiController from "../controllers/ai.controller.js";
const aiRouter = express.Router();

aiRouter.post(
    "/parse-jd",
    authenticate,
    aiController.parseJDController

);
aiRouter.post(
    "/parse-resume",
    authenticate,
    aiController.parseResumeController

);

export default aiRouter;