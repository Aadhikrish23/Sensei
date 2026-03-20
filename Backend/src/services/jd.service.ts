import prisma from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

interface UpdateJDParams {
  title?: string;
  rawText?: string;
  roleCategory?: string;
}
async function createJD(
  userId: string,
  title: string,
  rawText: string,
  roleCategory?: string,
) {
  const jdData = await prisma.jobDescription.create({
    data: {
      userId,
      title,
      rawText,
      roleCategory: roleCategory,
    },
  });

  return jdData;
}
async function getUserJDs(userId: string) {
  const jdData = await prisma.jobDescription.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      parsedData: true,
    },
  });

  return jdData;
}

async function getJDById(userId: string, JDId: string) {
  const jdData = await prisma.jobDescription.findFirst({
    where: {
      userId: userId,
      id: JDId,
    },
    select: {
      id: true,
      title: true,
      rawText: true,
      createdAt: true,
      updatedAt: true,
      parsedData: true,
    },
  });
  return jdData;
}

async function updateJD(userId: string, JDId: string, data: UpdateJDParams) {
  const existJDData = await prisma.jobDescription.findFirst({
    where: {
      userId: userId,
      id: JDId,
    },
  });
  if (!existJDData) {
    throw new Error("JD not found");
  }

  const jdData = await prisma.jobDescription.update({
    where: {
      id: JDId,
    },
    data: data,
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return jdData;
}

async function deleteJD(userId: string, JDId: string) {
  const existJDData = await prisma.jobDescription.findFirst({
    where: {
      id: JDId,
      userId: userId,
    },
  });
  if (!existJDData) {
    throw new Error("JD not found");
  }

  const sessionCount = await prisma.interviewSession.count({
    where: { jdId: JDId },
  });

  if (sessionCount > 0) {
    throw new AppError(
      ` Cannot Delete , This JD is used in ${sessionCount} interview session(s)`,
      400,
      "JD_IN_USE",
    );
  }
  const jdData = await prisma.jobDescription.delete({
    where: {
      id: JDId,
    },
  });
  return jdData;
}

export default { createJD, getUserJDs, getJDById, updateJD, deleteJD };
