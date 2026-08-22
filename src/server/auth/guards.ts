import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireOnboarded() {
  const session = await requireUser();
  if (!session.onboarded) redirect("/onboarding");
  return session;
}
