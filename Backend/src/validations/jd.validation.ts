import { z } from "zod";

export const createJDSchema = z.object({
  title: z.string().trim().min(8).max(72),

  rawText: z.string().trim().min(32).max(15000),

  roleCategory: z.string().optional(),
});

export const updateJDSchema = z.object({
  title: z.string().trim().min(8).max(72).optional(),

  rawText: z.string().trim().min(32).max(15000).optional(),

  roleCategory: z.string().optional(),
});
