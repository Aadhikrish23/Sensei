import express from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/signup",authController.signup);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.post("/login",authController.login);
authRouter.post("/refresh",authController.refresh);
authRouter.post("/logout",authController.loggout);

export default authRouter;