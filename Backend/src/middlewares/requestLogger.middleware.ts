import { Request, Response, NextFunction } from "express";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : "info";
    req.logger[level]({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
    });
  });

  next();
};