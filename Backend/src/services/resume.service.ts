import fs from "fs/promises";

import prisma from "../lib/prisma.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

interface UploadResumeParams {
  userId: string;
  filePath: string;
  title: string;
}

async function extractTextFromPDF(filePath: string): Promise<string> {
const buffer = await fs.readFile(filePath);   // async read

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
  filePath,
  title,
}: UploadResumeParams) {
  let extractedText = await extractTextFromPDF(filePath);

  extractedText = extractedText.replace(/[ \t]+/g, " ");

  extractedText = extractedText.replace(/\n{2,}/g, "\n");

  extractedText = extractedText.replace(/(?<!\n)([A-Z]{3,})/g, "\n$1");

  extractedText = extractedText.trim();

  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      filePath,
      extractedText,
    },
  });

  return resume;
}

async function deleteResumeService(
  resumeId: string,
  userId: string
) {

  // 1️⃣ Ownership check
  const resumeRecord = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
  });

  if (!resumeRecord) {
    throw new Error("Resume not found");
  }

  // 2️⃣ Delete from DB (source of truth)
  await prisma.resume.delete({
    where: { id: resumeId },
  });

  // 3️⃣ Attempt file deletion safely
  try {
    await fs.unlink(resumeRecord.filePath);
  } catch (error) {
    console.error("File deletion failed:", error);
    // Do NOT throw — DB already clean
  }

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
    },
  });

  return resumes;
}
async function getUserResumeById(
  userId: string,
  resumeId: string
) {
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
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
}
async function renameResume(
  resumeId: string,
  userId: string,
  newTitle: string
) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
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
export default { uploadResumeService,deleteResumeService,getUserResumes,renameResume,getUserResumeById};
