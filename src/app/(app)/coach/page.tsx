import { loadCoachHistory } from "@/features/ai/actions";
import { nvidiaConfigured } from "@/server/ai/nvidia";
import { CoachChat } from "./coach-chat";

export const maxDuration = 60;

export default async function CoachPage() {
  const history = await loadCoachHistory();
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">AI coach</h1>
      <CoachChat
        aiReady={nvidiaConfigured()}
        initial={history.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }))}
      />
    </main>
  );
}
