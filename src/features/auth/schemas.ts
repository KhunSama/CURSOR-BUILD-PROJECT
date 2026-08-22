import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(72),
});

export const forgotSchema = z.object({
  email: z.email(),
});

export const resetSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8).max(72),
});
