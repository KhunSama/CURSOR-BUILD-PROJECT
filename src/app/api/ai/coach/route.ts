import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { coachReply } from "@/features/ai/coach";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.onboarded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { question?: string };
    const question = String(body.question ?? "").trim().slice(0, 500);
    if (question.length < 3) {
      return NextResponse.json(
        { error: "Ask a short nutrition question." },
        { status: 400 },
      );
    }
    const result = await coachReply(session.userId, question);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Coach failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
