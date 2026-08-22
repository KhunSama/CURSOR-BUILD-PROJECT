import { loadCoachHistory } from "@/features/ai/actions";
import { CoachChat } from "./coach-chat";

export default async function CoachPage() {
  const history = await loadCoachHistory();
  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-display text-3xl text-gold">AI coach</h1>
      <CoachChat
        initial={history.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }))}
      />
    </main>
  );
}
