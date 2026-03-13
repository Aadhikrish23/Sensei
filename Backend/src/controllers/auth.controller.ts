import { Request, Response } from "express";
import authServices from "../services/auth.services.js";
import authValidation from "../validations/auth.validation.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const signup = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authValidation.signupSchema.parse(req.body);

  const userdata = await authServices.createUser(
    validatedData.email,
    validatedData.password,
  );

  return res.status(201).json({ Status: "SUCCESS", Data: userdata });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authValidation.loginSchema.parse(req.body);
  const userdata = await authServices.loginuser(
    validatedData.email,
    validatedData.password,
  );
  if (userdata.status === "Not Verified") {
    return res.status(201).json({ Status: "Not Verified", Data: userdata });
  } else if (userdata.status === "Verified") {
    const accessToken = userdata.accessToken;
    const refreshToken = userdata.refreshToken;
    const refreshDays = parseInt(
      process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshDays * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      status: "SUCCESS",
      Data: {
        id: userdata.id,
        accessToken,
        isEmailVerified: userdata.isEmailVerified,
      },
    });
  }
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError("Session expired login again...", 400);
  }
  const { accessToken, refreshToken, userid } =
    await authServices.refresh(token);
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: refreshDays * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    status: "SUCCESS",
    Data: {
      accessToken,
      id: userid,
    },
  });
});
const loggout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await authServices.logout(token);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });

  return res.status(200).json({ Status: "SUCCESS", Data: "User Logged out " });
});
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    throw new AppError("Verification token is missing", 404);
  }
  const { accessToken, refreshToken, userid } =
    await authServices.verifyEmail(token);
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: refreshDays * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    status: "SUCCESS",
    Data: { id: userid, accessToken },
  });
});
export default { signup, login, verifyEmail, refresh, loggout };
