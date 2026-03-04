import express from "express";
import cors from"cors";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errors.middleware.js";
import cookieParser from "cookie-parser";
import connectMongo from "./lib/mongo.js";
import resumeRoutes from "./routes/resume.routes.js";
import jdRouter from "./routes/jd.routes.js";
import aiRouter from "./routes/ai.routes.js";


const app = express();
const PORT = 5000;
const allowedOrgin = process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin:allowedOrgin,
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jd",jdRouter);  
app.use("/api/ai",aiRouter);  
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Sensei Backend Running 🔥");
});

const startserver = async () => {
  await connectMongo();
  app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}

startserver();