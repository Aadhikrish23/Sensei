import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import jdController from "../controllers/jd.controller.js";

const jdRouter = express.Router();

jdRouter.post(
    "/upload",
    authenticate,
    jdController.uploadJD

);
jdRouter.get(
    "/",
    authenticate,
    jdController.getUserJDs
    
);
jdRouter.get(
    "/:id",
    authenticate,
    jdController.getJDById

);
jdRouter.patch(
    "/:id",
    authenticate,
    jdController.updateJD
);
jdRouter.delete(
    "/:id",
    authenticate,
    jdController.deleteJD
);

export default jdRouter;