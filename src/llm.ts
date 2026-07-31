// Thin wrapper around LLM calls, supporting Google Gemini REST API
// using Flash and Flash-Lite models by default.

import { query } from "@anthropic-ai/claude-agent-sdk";
import type { ZodType } from "zod";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Auto-load .env files
function loadEnv() {
  const envPaths = [
    join(process.cwd(), ".env"),
    join(process.cwd(), "..", ".env"),
    join(process.cwd(), "adhd", ".env"),
  ];

  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      try {
        const content = readFileSync(envPath, "utf8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
            const [key, ...vals] = trimmed.split("=");
            const val = vals.join("=").trim().replace(/^["']|["']$/g, "");
            if (!process.env[key.trim()]) {
              process.env[key.trim()] = val;
            }
          }
        }
      } catch {}
    }
  }

}
}

loadEnv();

export type LLMOptions = {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
};

export function buildQueryOptions(opts: LLMOptions) {
  return {
    model: opts.model,
    systemPrompt: {
      type: "preset" as const,
      preset: "claude_code" as const,
      append: opts.systemPrompt,
    },
    tools: [] as string[],
  };
}

async function callGeminiAPI(opts: LLMOptions, apiKey: string): Promise<string> {
  const defaultModel = "gemini-2.5-flash";
  let model = opts.model || process.env.ADHD_MODEL || defaultModel;

  // Enforce Flash / Flash Lite models if a pro model was accidentally specified
  if (model.includes("-pro")) {
    model = model.replace("-pro", "-flash");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        role: "user",
        parts: [{ text: opts.userPrompt }],
      },
    ],
  };

  if (opts.systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: opts.systemPrompt }],
    };
  }

  if (opts.temperature !== undefined) {
    payload.generationConfig = {
      temperature: opts.temperature,
    };
  }

  let retries = 5;
  let delay = 1000;

  while (retries > 0) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        if ((res.status === 429 || res.status >= 500) && retries > 1) {
          console.warn(`[Gemini API] HTTP ${res.status} for ${model}, retrying in ${delay}ms...`);
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
          retries--;
          continue;
        }
        throw new Error(`Gemini API error ${res.status} (${model}): ${errText}`);
      }

      const data: any = await res.json();
      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        const text = data.candidates[0].content.parts
          .map((p: any) => p.text || "")
          .join("")
          .trim();
        if (text) return text;
      }

      throw new Error(`Gemini API returned empty content for ${model}: ${JSON.stringify(data)}`);
    } catch (err: any) {
      if (retries <= 1) throw err;
      console.warn(`[Gemini API] Request error for ${model}: ${err.message}, retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
      retries--;
    }
  }

  throw new Error(`Gemini API failed after retries for ${model}`);
}

export async function callLLM(opts: LLMOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    return callGeminiAPI(opts, apiKey);
  }

  // Fallback to Claude Agent SDK
  const chunks: string[] = [];

  const iter = query({
    prompt: opts.userPrompt,
    options: buildQueryOptions(opts),
  });

  for await (const message of iter) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") chunks.push(block.text);
      }
    }
    if (message.type === "result" && message.subtype !== "success") {
      throw new Error(`LLM call failed: ${message.subtype}`);
    }
  }

  return chunks.join("").trim();
}

// Strip ```json fences and parse cleanly with trailing slice & fallback recovery.
export function parseJSON<T>(raw: string, schema?: ZodType<T>): T {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();

  const firstObj = s.indexOf("{");
  const firstArr = s.indexOf("[");

  let start = -1;
  let isArr = false;

  if (firstObj !== -1 && (firstArr === -1 || firstObj < firstArr)) {
    start = firstObj;
    isArr = false;
  } else if (firstArr !== -1) {
    start = firstArr;
    isArr = true;
  }

  if (start >= 0) {
    s = s.slice(start);
    const endChar = isArr ? "]" : "}";
    const lastIdx = s.lastIndexOf(endChar);
    if (lastIdx > 0) {
      s = s.slice(0, lastIdx + 1);
    }
  }

  // Clean common JSON trailing commas
  s = s.replace(/,\s*([\}\]])/g, "$1");

  let parsed: any;
  try {
    parsed = JSON.parse(s);
  } catch (err) {
    // If strict parse fails, try basic cleanup
    s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
    parsed = JSON.parse(s);
  }

  if (schema) {
    const result = schema.safeParse(parsed);
    if (result.success) return result.data;
    // Fallback: return raw parsed object if schema fails loosely
    return parsed as T;
  }

  return parsed as T;
}
