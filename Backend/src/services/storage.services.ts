import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import storage from "../lib/storage.js";

import fs from "fs/promises";
import path from "path";

const bucket = process.env.R2_BUCKET!;
const isDev = process.env.NODE_ENV !== "production";

export async function uploadResumeFile(
  buffer: Buffer,
  filename: string
) {
  const key = `resumes/${filename}`;

  // ✅ LOCAL STORAGE
  if (isDev) {
    const uploadDir = path.join(process.cwd(), "uploads/resumes");

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    return `uploads/resumes/${filename}`;
  }

  // ☁️ R2 STORAGE
  await storage.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
    })
  );

  return key;
}

export async function generateSignedUrl(key: string) {

  // ✅ LOCAL FILE DOWNLOAD
  if (isDev) {
    return `http://localhost:5000/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(storage, command, {
    expiresIn: 60 * 5,
  });

  return url;
}