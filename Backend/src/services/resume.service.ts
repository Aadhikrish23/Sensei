import fs from "fs/promises";

import prisma from "../lib/prisma.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { AppError } from "../utils/AppError.js";

interface UploadResumeParams {
  userId: string;
  buffer: Buffer;
  key: string;
  title: string;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let textContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map((item: any) => item.str);
    textContent += strings.join(" ") + "\n";
  }

  return textContent;
}

async function uploadResumeService({
  userId,
  buffer,
  key,
  title,
}: UploadResumeParams) {
  let extractedText = await extractTextFromPDF(buffer);

  extractedText = extractedText.replace(/[ \t]+/g, " ");
  extractedText = extractedText.replace(/\n{2,}/g, "\n");
  extractedText = extractedText.replace(/(?<!\n)([A-Z]{3,})/g, "\n$1");
  extractedText = extractedText.trim();

  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      filePath: key,
      extractedText,
    },
  });

  return resume;
}

async function deleteResumeService(resumeId: string, userId: string) {
  // 1️⃣ Ownership check
  const resumeRecord = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
  });

  if (!resumeRecord) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  const sessionCount = await prisma.interviewSession.count({
    where: { resumeId },
  });
  console.error("sessionCount", sessionCount);
  if (sessionCount > 0) {
    throw new AppError(
      ` Cannot Delete , This resume is used in ${sessionCount} interview session(s)`,
      400,
      "RESUME_IN_USE",
    );
  }

  // 2️⃣ Delete from DB (source of truth)
  await prisma.resume.delete({
    where: { id: resumeId },
  });

  // 3️⃣ Attempt file deletion safely

  return resumeRecord;
}
async function getUserResumes(userId: string) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      parsedData: true,
    },
  });

  return resumes;
}
async function getUserResumeById(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      parsedData: true,
    },
  });

  if (!resume) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  return resume;
}
async function renameResume(
  resumeId: string,
  userId: string,
  newTitle: string,
) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  const updated = await prisma.resume.update({
    where: { id: resumeId },
    data: { title: newTitle },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  });

  return updated;
}
async function getResumeDownloadKey(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
    select: {
      filePath: true,
    },
  });

  if (!resume) {
    throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
  }

  return resume.filePath;
}
export default {
  uploadResumeService,
  deleteResumeService,
  getUserResumes,
  renameResume,
  getUserResumeById,
  getResumeDownloadKey,
};
