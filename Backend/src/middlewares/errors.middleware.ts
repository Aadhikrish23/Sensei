import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { Prisma } from "@prisma/client";

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
      status: "ERROR",
      message: err.issues.map((e) => e.message).join(", "),
      code: "VALIDATION_ERROR",
    });
  }

  // Prisma Known Errors
  // Prisma Unknown Errors (VERY IMPORTANT)
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(500).json({
      status: "ERROR",
      message: "Database error occurred",
      code: "DB_ERROR",
    });
  }

  // Custom App Error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "ERROR",
      message: err.message,
      code: err.code,
    });
  }

  // Default Express Error
  if (err instanceof Error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Something went wrong",
      code: "INTERNAL_ERROR",
    });
  }

  return res.status(500).json({
    status: "ERROR",
    message: "Internal Server Error",
  });
};
