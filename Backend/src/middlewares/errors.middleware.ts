import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

const isProduction = process.env.NODE_ENV === "production";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error =
    err instanceof Error ? err : new Error("Unknown error occurred");

  // 🧠 Determine status code
  let statusCode = 500;

  if (err instanceof ZodError) statusCode = 400;
  else if (err instanceof AppError) statusCode = err.statusCode;

  // 🔥 Choose log level
  const level = statusCode >= 500 ? "error" : "warn";

  // 🔥 Structured logging
  req.logger[level]({
    message: error.message,
    stack: isProduction ? undefined : error.stack,
    url: req.originalUrl,
    method: req.method,
    statusCode,
  });

  // 🧪 Zod Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "FAIL",
      errors: err.issues.map((e) => e.message),
    });
  }

  // 🧪 App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "ERROR",
      message: err.message,
    });
  }

  // 🧪 Default
  return res.status(statusCode).json({
    status: "ERROR",
    message: isProduction
      ? "Something went wrong"
      : error.message,
  });
};