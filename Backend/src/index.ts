import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import jdRouter from "./routes/jd.routes.js";
import aiRouter from "./routes/ai.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import sessionSummaryRouter from "./routes/sessionSummary.routes.js";
import reportRouter from "./routes/finalReport.routes.js";

import { errorHandler } from "./middlewares/errors.middleware.js";
import connectMongo from "./lib/mongo.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import path from "path";
import { requestIdMiddleware } from "./middlewares/requestId.js";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.js";

const app = express();

const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Trust Proxy (needed for Railway / Render / Vercel proxies)
|--------------------------------------------------------------------------
*/
app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| Security Middlewares
|--------------------------------------------------------------------------
*/
app.use(helmet());



/*
|--------------------------------------------------------------------------
| Rate Limiter
|--------------------------------------------------------------------------
*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later.",
});

app.use(globalLimiter);

/*
|--------------------------------------------------------------------------
| Auth Rate Limiter (stricter)
|--------------------------------------------------------------------------
*/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Try again later.",
  skip: (req) => req.method === "OPTIONS",
});

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/
const allowedOrigins = process.env.CORS_ALLOWED_ORIGIN
  ? process.env.CORS_ALLOWED_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


/*
|--------------------------------------------------------------------------
| Parsers
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Logging 
|--------------------------------------------------------------------------
*/

app.use(requestIdMiddleware);     
app.use(requestLoggerMiddleware); 



/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authLimiter, authRouter);

app.use("/api/resumes", resumeRoutes);
app.use("/api/jd", jdRouter);
app.use("/api/ai", aiRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/session-summary", sessionSummaryRouter);
app.use("/api/report", reportRouter);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("Sensei Backend Running 🔥");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});



/*
|--------------------------------------------------------------------------
| Swagger API Docs
|--------------------------------------------------------------------------
*/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
const startServer = async () => {
  try {
    await connectMongo();

    app.listen(PORT, () => {
      console.log(`🚀 Sensei backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();