import { z } from "zod";

export const resumeIdParamSchema = z.object({
  id: z.string().uuid("Invalid resume ID format"),
});

export const renameResumeSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title too long")
    .trim(),
});