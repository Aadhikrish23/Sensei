import { Request, Response } from "express";
import authServices from "../services/auth.services.js";
import authValidation from "../validations/auth.validation.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

const getRefreshCookieOptions = () => {
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7"
  );

  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge: refreshDays * 24 * 60 * 60 * 1000,
  };
};

const signup = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authValidation.signupSchema.parse(req.body);

  const userdata = await authServices.createUser(
    validatedData.email,
    validatedData.password
  );

  return res.status(201).json({
    Status: "SUCCESS",
    Data: userdata,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = authValidation.loginSchema.parse(req.body);

  const userdata = await authServices.loginuser(
    validatedData.email,
    validatedData.password
  );

  if (userdata.status === "Not Verified") {
    return res.status(200).json({
      Status: "Not Verified",
      Data: userdata,
    });
  }

  if (userdata.status === "Verified") {
    const cookieOptions = getRefreshCookieOptions();

    res.cookie("refreshToken", userdata.refreshToken, cookieOptions);

    return res.status(200).json({
      status: "SUCCESS",
      Data: {
        id: userdata.id,
        accessToken: userdata.accessToken,
        isEmailVerified: userdata.isEmailVerified,
      },
    });
  }

  throw new AppError("Login failed", 400);
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new AppError("Session expired login again...", 401);
  }

  const { accessToken, refreshToken, userid } =
    await authServices.refresh(token);

  const cookieOptions = getRefreshCookieOptions();

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json({
    status: "SUCCESS",
    Data: {
      accessToken,
      id: userid,
    },
  });
});

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    throw new AppError("Verification token is missing", 400);
  }

  const { accessToken, refreshToken, userid } =
    await authServices.verifyEmail(token);

  const cookieOptions = getRefreshCookieOptions();

  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json({
    status: "SUCCESS",
    Data: {
      id: userid,
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await authServices.logout(token);
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    Status: "SUCCESS",
    Data: "User logged out",
  });
});

export default {
  signup,
  login,
  verifyEmail,
  refresh,
  logout,
};