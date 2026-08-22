"use server";

import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  clearSessionCookie,
  setSessionCookie,
} from "@/server/auth/session";
import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "@/features/auth/schemas";

export type AuthState = { error?: string; resetUrl?: string };

function form(data: FormData) {
  const obj = Object.fromEntries(data.entries());
  if (typeof obj.email === "string") obj.email = obj.email.trim().toLowerCase();
  return obj;
}

export async function registerAction(
  _prev: AuthState,
  data: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse(form(data));
  if (!parsed.success) {
    return { error: "Check name, email, and a password of at least 8 characters." };
  }
  const exists = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) return { error: "An account with that email already exists." };

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
      streak: { create: {} },
    },
  });
  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    onboarded: false,
  });
  redirect("/onboarding");
}

export async function loginAction(
  _prev: AuthState,
  data: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse(form(data));
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { profile: true },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { error: "Email or password is incorrect." };
  }
  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    onboarded: Boolean(user.profile),
  });
  redirect(user.profile ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}

export async function forgotPasswordAction(
  _prev: AuthState,
  data: FormData,
): Promise<AuthState> {
  const parsed = forgotSchema.safeParse(form(data));
  if (!parsed.success) return { error: "Enter a valid email." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { error: "If that email exists, a reset link is shown below for this demo." };
  }
  const token = randomBytes(24).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  return { resetUrl: `/reset-password?token=${token}` };
}

export async function resetPasswordAction(
  _prev: AuthState,
  data: FormData,
): Promise<AuthState> {
  const parsed = resetSchema.safeParse(form(data));
  if (!parsed.success) return { error: "Token missing or password too short." };
  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const row = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!row || row.expiresAt < new Date()) {
    return { error: "This reset link is invalid or expired." };
  }
  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: await hashPassword(parsed.data.password) },
  });
  await prisma.passwordResetToken.delete({ where: { id: row.id } });
  redirect("/login");
}
