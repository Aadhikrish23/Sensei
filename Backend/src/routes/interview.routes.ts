import  express  from "express";
import authenticate from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

interviewRouter.post("/start-interview",authenticate,interviewController.startInterview)

export default interviewRouter;
