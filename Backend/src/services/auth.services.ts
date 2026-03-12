import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { sendVerificationEmail } from "./email.service.js";

interface payloaddata {
  email: string;
  password: string;
}

async function createUser(email: string, password: string) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 15);

  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      verificationToken: token,
      verificationExpires: expiry,
    },
  });

const verificationLink =
  `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await sendVerificationEmail(email, verificationLink);

return {
  id: user.id,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt
};
}

async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new Error("Invalid or expired verification link");
  }

  if (!user.verificationExpires || user.verificationExpires < new Date()) {
    throw new Error("Invalid or expired verification link");
  }

  const accessToken = generateToken(user.id, user.email, "access");
  const refreshToken = generateToken(user.id, user.email, "refresh");

  // Calculate refresh expiry safely
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
  );

  const refreshExpires = new Date(
    Date.now() + refreshDays * 24 * 60 * 60 * 1000,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationExpires: null,
      refreshToken,
      refreshExpires,
    },
  });

  return {
     userid:user.id,
     isEmailVerified:user.isEmailVerified,
    accessToken,
    refreshToken,
  };
}

async function loginuser(email: string, password: string) {
  const userdata = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!userdata) {
    throw new Error(" Invalid credentials");
  }

  const validpassword = await bcrypt.compare(password, userdata.password);
  if (!validpassword) {
    throw new Error(" Invalid credentials");
  }
  if (!userdata.isEmailVerified) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 15);

    const user = await prisma.user.update({
      where: { id: userdata.id },
      data: {
        verificationToken: token,
        verificationExpires: expiry,
      },
    });
    console.log("Calling email service for:", email);

   const verificationLink =
  `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
     console.log("EMAIL FUNCTION START");
await sendVerificationEmail(email, verificationLink);
console.log("EMAIL FUNCTION END");


    return {
      status: "Not Verified",
      isEmailVerified:userdata.isEmailVerified,
      
    };
  }
  const accessToken = generateToken(userdata.id, userdata.email, "access");
  const refreshToken = generateToken(userdata.id, userdata.email, "refresh");

  // Calculate refresh expiry safely
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
  );

  const refreshExpires = new Date(
    Date.now() + refreshDays * 24 * 60 * 60 * 1000,
  );

  await prisma.user.update({
    where: { id: userdata.id },
    data: {
      refreshToken,
      refreshExpires,
    },
  });

  return {
    status: "Verified",
    id:userdata.id,
    isEmailVerified:userdata.isEmailVerified,
    accessToken,
    refreshToken,
  };
}

async function refresh(token: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  const expiry = process.env.REFRESH_TOKEN_EXPIRY;
  if (!secret || !expiry) {
    throw new Error("JWT configuration missing");
  }
  const validtoken = jsonwebtoken.verify(token, secret) as payloaddata;

  const userdata = await prisma.user.findUnique({
    where: {
      refreshToken: token,
    },
  });
  if (!userdata || validtoken.email !== userdata.email) {
    throw new Error("Session expired login again...");
  }
  if (!userdata.refreshExpires || userdata.refreshExpires < new Date()) {
    throw new Error("Session expired login again...");
  }
  const accessToken = generateToken(userdata.id, userdata.email, "access");
  const refreshToken = generateToken(userdata.id, userdata.email, "refresh");

  // Calculate refresh expiry safely
  const refreshDays = parseInt(
    process.env.REFRESH_TOKEN_EXPIRY?.replace("d", "") || "7",
  );

  const refreshExpires = new Date(
    Date.now() + refreshDays * 24 * 60 * 60 * 1000,
  );

  await prisma.user.update({
    where: { id: userdata.id },
    data: {
      refreshToken,
      refreshExpires,
    },
  });

  return {
    userid:userdata.id,
    accessToken,
    refreshToken,
  };
}

async function logout(token: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  const expiry = process.env.REFRESH_TOKEN_EXPIRY;
  if (!secret || !expiry) {
    throw new Error("JWT configuration missing");
  }
  const validtoken = jsonwebtoken.verify(token, secret) as payloaddata;

  const userdata = await prisma.user.findUnique({
    where: {
      refreshToken: token,
    },
  });
  if (!userdata || validtoken.email !== userdata.email) {
    throw new Error("Session expired login again...");
  }
  const userlogout = await prisma.user.update({
    data: { refreshToken: null, refreshExpires: null },
    where: { id: userdata.id },
  });
  return "Success";
}

function generateToken(id: string, email: string, type: "access" | "refresh") {
  const secret =
    type === "access"
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET;

  const expiry =
    type === "access"
      ? process.env.ACCESS_TOKEN_EXPIRY
      : process.env.REFRESH_TOKEN_EXPIRY;

  if (!secret || !expiry) {
    throw new Error("JWT configuration missing");
  }

  return jsonwebtoken.sign({ id, email }, secret, { expiresIn: expiry as any });
}
export default { createUser, loginuser, verifyEmail, refresh, logout };
