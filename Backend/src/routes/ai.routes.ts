import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import aiController from "../controllers/ai.controller.js";
const aiRouter = express.Router();

aiRouter.post(
    "/parse",
    authenticate,
    aiController.parseJDController

);

export default aiRouter;