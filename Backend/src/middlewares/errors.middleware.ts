import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ Status: "Fail", errors: err.issues.map((e) => e.message) });
  }
  if (err instanceof Error) {
    return res.status(400).json({
      status: "ERROR",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "ERROR",
    message: "Internal Server Error",
  });
};
