import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger/logger.js";
import { Sentry } from "../lib/sentry.js";
// 1️⃣ Extend Express Request type
declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    logger: typeof logger;
  }
}

// 2️⃣ Middleware
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Generate unique ID
  const requestId = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  // Attach to request
  req.requestId = requestId;

  // Create child logger with context
  req.logger = logger.child({ requestId });
  Sentry.setTag("requestId", requestId);
  next();
};
