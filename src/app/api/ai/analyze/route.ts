import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { analyzeMealDescription } from "@/features/ai/analyze";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.onboarded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { description?: string };
    const description = String(body.description ?? "").trim();
    if (description.length < 3) {
      return NextResponse.json(
        { error: "Describe what you ate in a bit more detail." },
        { status: 400 },
      );
    }
    const result = await analyzeMealDescription(description);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analyze failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
