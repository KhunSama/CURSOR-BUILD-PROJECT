type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type NvidiaChoice = {
  message?: {
    content?: string | null;
    reasoning_content?: string | null;
  };
};

export type NvidiaChatResult = {
  content: string;
  reasoning: string | null;
};

export function nvidiaConfigured() {
  return Boolean(process.env.NVIDIA_API_KEY);
}

export async function nvidiaChat(options: {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<NvidiaChatResult | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (
    process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1"
  ).replace(/\/$/, "");
  const model = process.env.NVIDIA_MODEL ?? "openai/gpt-oss-20b";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 1,
      top_p: 1,
      max_tokens: options.maxTokens ?? 4096,
      stream: false,
    }),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { choices?: NvidiaChoice[] };
  const message = data.choices?.[0]?.message;
  const content = message?.content?.trim() ?? "";
  const reasoning = message?.reasoning_content?.trim() || null;
  if (!content && !reasoning) return null;
  return { content: content || reasoning || "", reasoning };
}

export function extractJsonObject(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}
