import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  console.error("ERROR:", err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "FAIL",
      errors: err.issues.map((e) => e.message),
    });
  }

  // Custom App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "ERROR",
      message: err.message,
    });
  }

  // Default Express Error
  if (err instanceof Error) {
    return res.status(500).json({
      status: "ERROR",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "ERROR",
    message: "Internal Server Error",
  });
};