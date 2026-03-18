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
import { requestIdMiddleware } from "./middlewares/requestId.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware.js";

import { initSentry, Sentry } from "./lib/sentry.js";
import logger from "./utils/logger/logger.js";

const app = express();

const PORT = process.env.PORT || 5000;

initSentry();

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
  }),
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
| Rate Limiter
|--------------------------------------------------------------------------
*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => req.method === "OPTIONS",

  handler: (req, res) => {
    req.logger?.warn({
      event: "RATE_LIMIT_HIT",
      type: "GLOBAL",
      requestId: req.requestId,
     method: req.method,
      userId: req.user?.id,
      url: req.originalUrl,
    });

    res.status(429).json({
      status: "FAIL",
      message: "Too many requests, please try again later.",
    });
  },
});

/*
|--------------------------------------------------------------------------
| Auth Rate Limiter 
|--------------------------------------------------------------------------
*/
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === "OPTIONS",

  handler: (req, res) => {
    req.logger?.warn({
      event: "RATE_LIMIT_HIT",
      type: "AUTH",
      requestId: req.requestId,
      method: req.method,
      userId: req.user?.id,
      url: req.originalUrl,
    });

    res.status(429).json({
      status: "FAIL",
      message: "Too many authentication attempts. Try again later.",
    });
  },
});
/*
|--------------------------------------------------------------------------
| AI Rate Limiter 
|--------------------------------------------------------------------------
*/
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  skip: (req) => req.method === "OPTIONS",

  handler: (req, res) => {
    req.logger?.warn({
      event: "RATE_LIMIT_HIT",
      type: "AI",
      requestId: req.requestId,
      method: req.method,
      userId: req.user?.id,
      url: req.originalUrl,
    });

    res.status(429).json({
      status: "FAIL",
      message: "Too many AI requests. Please slow down.",
    });
  },
});


app.use(globalLimiter); 


/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);

app.use("/api/auth", authRouter);

app.use("/api/resumes", resumeRoutes);
app.use("/api/jd", jdRouter);
app.use("/api/ai", aiLimiter, aiRouter);
app.use("/api/interview", aiLimiter, interviewRouter);
app.use("/api/session-summary", sessionSummaryRouter);
app.use("/api/report", aiLimiter, reportRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
app.get("/test-error", (req, res) => {
  throw new Error("Sentry working 🚨");
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
Sentry.setupExpressErrorHandler(app);
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
      // console.log(`🚀 Sensei backend running on port ${PORT}`);
      logger.info(`🚀 Sensei backend running on port ${PORT}`);
    });
  } catch (error) {
    // console.error("❌ Failed to start server:", error);
    logger.error("❌ Failed to start server:" + error);
    process.exit(1);
  }
};

startServer();
