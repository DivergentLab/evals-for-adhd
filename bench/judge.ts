// LLM-as-judge.
//
// We can't ground-truth ideation, so we use a separate critic pass to score
// two outputs (ADHD vs baseline) on the dimensions that matter for *open-ended*
// design work: breadth, novelty, trap detection, actionability, and overall
// usefulness to a builder.
//
// To reduce same-model bias: the judge runs with a system prompt that asks
// for adversarial reading ("be a skeptical staff engineer"), and it sees BOTH
// outputs blinded (labelled A/B in random order per problem) so positional bias
// is balanced across runs.

import { callLLM, parseJSON } from "../src/llm.js";

export type Verdict = {
  breadth: { a: number; b: number; reason: string };       // 0-10, range of distinct angles
  novelty: { a: number; b: number; reason: string };       // 0-10, non-obvious-but-viable
  trap_detection: { a: number; b: number; reason: string };// 0-10, names traps with reasons
  actionability: { a: number; b: number; reason: string }; // 0-10, gives concrete first steps
  builder_usefulness: { a: number; b: number; reason: string }; // 0-10, would a builder ship from this?
  overall_winner: "A" | "B" | "tie";
  one_line_summary: string;
};

const JUDGE_SYSTEM = `You are a skeptical staff engineer reviewing two ideation outputs (A and B)
for the same problem. Your job is to score them on the dimensions of open-ended
design work, not on prose polish.

You do NOT know which system produced which output. Score on substance only.

Rubric (each dimension 0-10):
- breadth: range of structurally DISTINCT angles. 10 minor variations of one idea = low breadth.
- novelty: how many ideas are non-obvious-but-viable. The obvious textbook answer is NOT novel.
- trap_detection: does it name ideas that look good but are traps, with reasons?
- actionability: does the top recommendation have a sketch, named risk, and first concrete step?
- builder_usefulness: if you were the engineer who had to ship, which is more useful to you?

Then declare overall_winner: "A", "B", or "tie".
Output JSON only. No prose preamble.`;

export async function judge(
  problem: string,
  outputA: string,
  outputB: string,
  model?: string,
): Promise<Verdict> {
  const userPrompt = `PROBLEM:
${problem}

OUTPUT A:
${outputA}

---

OUTPUT B:
${outputB}

---

Score both on the rubric. Output JSON of shape:
{
  "breadth": {"a": 0-10, "b": 0-10, "reason": "..."},
  "novelty": {"a": 0-10, "b": 0-10, "reason": "..."},
  "trap_detection": {"a": 0-10, "b": 0-10, "reason": "..."},
  "actionability": {"a": 0-10, "b": 0-10, "reason": "..."},
  "builder_usefulness": {"a": 0-10, "b": 0-10, "reason": "..."},
  "overall_winner": "A" | "B" | "tie",
  "one_line_summary": "..."
}`;

  let lastErr: any;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await callLLM({ model, systemPrompt: JUDGE_SYSTEM, userPrompt });
      return parseJSON<Verdict>(raw);
    } catch (err) {
      lastErr = err;
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }
  throw lastErr;
}
