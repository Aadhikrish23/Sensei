import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import storage from "../lib/storage.js";

const bucket = process.env.R2_BUCKET!;

export async function uploadResumeFile(
  buffer: Buffer,
  filename: string
) {

  const key = `resumes/${filename}`;

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

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(storage, command, {
    expiresIn: 60 * 5,
  });

  return url;
}