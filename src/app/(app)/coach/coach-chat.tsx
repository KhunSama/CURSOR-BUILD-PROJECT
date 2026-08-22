"use client";

import { useState, useTransition } from "react";
import { Disclaimer } from "@/shared/ui/disclaimer";

type Msg = { id: string; role: string; content: string };

export function CoachChat({
  initial,
  aiReady,
}: {
  initial: Msg[];
  aiReady: boolean;
}) {
  const [messages, setMessages] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    aiReady
      ? null
      : "NVIDIA_API_KEY is not set on this deployment. Add it in Vercel env vars — it is not in git.",
  );

  return (
    <div className="grid gap-4">
      <Disclaimer />
      {notice ? <p className="text-sm text-amber-200">{notice}</p> : null}
      <div className="grid max-h-[50vh] gap-3 overflow-auto rounded-2xl border border-stroke bg-panel p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Ask about dinner ideas, remaining protein, or a ~500 kcal meal.
          </p>
        ) : (
          messages.map((m) => (
            <p
              key={m.id}
              className={m.role === "user" ? "text-gold" : "text-foreground/90"}
            >
              <strong>{m.role === "user" ? "You" : "Coach"}:</strong> {m.content}
            </p>
          ))
        )}
      </div>
      <form
        className="grid gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const q = String(fd.get("q") ?? "");
          e.currentTarget.reset();
          start(async () => {
            const res = await fetch("/api/ai/coach", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question: q }),
            });
            const data = (await res.json()) as {
              error?: string;
              answer?: string;
              source?: string;
              warning?: string;
            };
            if (!res.ok || data.error) {
              setError(data.error ?? "Coach request failed");
              return;
            }
            setError(null);
            setNotice(data.warning ?? (data.source === "nvidia" ? null : data.warning ?? null));
            if (data.answer) {
              setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: "user", content: q },
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: data.answer!,
                },
              ]);
            }
          });
        }}
      >
        <textarea
          name="q"
          className="rounded-md border border-stroke bg-panel px-3 py-2"
          rows={3}
          required
        />
        {error ? <p className="text-red-300">{error}</p> : null}
        <button
          className="w-fit rounded-lg bg-gold px-4 py-2 text-background"
          disabled={pending}
          type="submit"
        >
          {pending ? "Thinking…" : "Ask"}
        </button>
      </form>
    </div>
  );
}
