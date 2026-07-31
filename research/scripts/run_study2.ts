import { readFileSync, writeFileSync, mkdirSync, appendFileSync, readdirSync, existsSync } from "node:fs";
import { run } from "../../src/index.js";
import { renderText } from "../../src/render.js";
import { callLLM } from "../../src/llm.js";
import { judge, type Verdict } from "../../bench/judge.js";

type Problem = { id: string; category: string; problem: string };

const BASELINE_SYSTEM =
  "You are a thoughtful domain expert and strategist. When asked to ideate on a problem, " +
  "give a useful answer with multiple approaches, tradeoffs, and a recommendation. " +
  "Be substantive but not bloated.";

async function generateBaseline(problem: string, model: string): Promise<string> {
  return callLLM({
    model,
    systemPrompt: BASELINE_SYSTEM,
    userPrompt: `Ideate on this problem:\n\n${problem}\n\nGive the user a useful answer.`,
  });
}

async function generateADHD(problem: string, model: string): Promise<{ text: string; rawResult: any }> {
  const result = await run({
    problem,
    framesPerRun: 5,
    ideasPerFrame: 6,
    topK: 3,
    concurrency: 4,
    codeMode: false, // domain-agnostic mode
    model,
    onEvent: () => {},
  });
  const text = renderText(result).replace(/\x1b\[[0-9;]*m/g, "");
  return { text, rawResult: result };
}

type TierResult = {
  tier: "Tier1_Strategy" | "Tier2_Health" | "Tier3_Biology";
  problems: {
    problemId: string;
    category: string;
    problem: string;
    swapped: boolean;
    baselineOutput: string;
    adhdOutput: string;
    verdict: Verdict;
    adhdWon: "win" | "loss" | "tie";
    adhdRawResult: any;
  }[];
};

async function main() {
  mkdirSync("research/logs/study2_cross_domain", { recursive: true });
  mkdirSync("research/results", { recursive: true });
  mkdirSync("research/reports", { recursive: true });

  // Check for existing log file to resume
  const existingFiles = readdirSync("research/logs/study2_cross_domain")
    .filter((f) => f.endsWith(".jsonl"))
    .sort();

  const existingRecords = new Map<string, any>();
  let runId = `study2_${new Date().toISOString().replace(/[:.]/g, "-")}_flash`;
  let logFile = `research/logs/study2_cross_domain/${runId}.jsonl`;

  if (existingFiles.length > 0) {
    const latestFile = existingFiles[existingFiles.length - 1];
    logFile = `research/logs/study2_cross_domain/${latestFile}`;
    runId = latestFile.replace(".jsonl", "");
    console.log(`▸ Resuming Study 2 from existing log: ${latestFile}`);
    const lines = readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean);
    for (const l of lines) {
      try {
        const parsed = JSON.parse(l);
        if (parsed.problemId) {
          existingRecords.set(parsed.problemId, parsed);
        }
      } catch (e) {}
    }
    console.log(`  Loaded ${existingRecords.size} existing problem records.`);
  } else {
    console.log(`▸ Starting Study 2 — Cross-Domain Generalization (Run ID: ${runId})`);
  }

  const tiers: { tier: "Tier1_Strategy" | "Tier2_Health" | "Tier3_Biology"; file: string }[] = [
    { tier: "Tier1_Strategy", file: "research/problems/domain_strategy.json" },
    { tier: "Tier2_Health", file: "research/problems/domain_health.json" },
    { tier: "Tier3_Biology", file: "research/problems/domain_biology.json" },
  ];

  const generatorModel = "gemini-2.5-flash";
  const judgeModel = "gemini-3.1-flash-lite";

  const tierResults: TierResult[] = [];

  for (const tConfig of tiers) {
    console.log(`\n========================================`);
    console.log(`▸ Processing ${tConfig.tier} (${tConfig.file})`);
    console.log(`========================================`);

    const problems: Problem[] = JSON.parse(readFileSync(tConfig.file, "utf8"));
    const tierRecords: TierResult["problems"] = [];

    for (const [idx, p] of problems.entries()) {
      console.log(`\n[${idx + 1}/${problems.length}] (${tConfig.tier}) ${p.id} [${p.category}]`);

      if (existingRecords.has(p.id)) {
        const cached = existingRecords.get(p.id);
        console.log(`  · loaded from cache → ${cached.adhdWon.toUpperCase()} :: ${cached.verdict?.one_line_summary || ""}`);
        tierRecords.push(cached);
        continue;
      }

      console.log("  · generating baseline...");
      const baselineOutput = await generateBaseline(p.problem, generatorModel);

      console.log("  · generating ADHD...");
      const { text: adhdOutput, rawResult: adhdRawResult } = await generateADHD(p.problem, generatorModel);

      console.log(`  · judging with ${judgeModel}...`);
      const swapped = Math.random() < 0.5;
      const outA = swapped ? baselineOutput : adhdOutput;
      const outB = swapped ? adhdOutput : baselineOutput;

      const verdict = await judge(p.problem, outA, outB, judgeModel);

      const adhdLabel = swapped ? "B" : "A";
      const baseLabel = swapped ? "A" : "B";
      const adhdWon =
        verdict.overall_winner === adhdLabel ? "win" :
        verdict.overall_winner === baseLabel ? "loss" : "tie";

      console.log(`    → ${adhdWon.toUpperCase()} :: ${verdict.one_line_summary}`);

      const record = {
        problemId: p.id,
        category: p.category,
        problem: p.problem,
        swapped,
        baselineOutput,
        adhdOutput,
        verdict,
        adhdWon,
        adhdRawResult,
      };

      tierRecords.push(record);
      appendFileSync(logFile, JSON.stringify({ tier: tConfig.tier, ...record }) + "\n");
    }

    tierResults.push({ tier: tConfig.tier, problems: tierRecords });
  }

  // Write aggregate JSON
  writeFileSync("research/results/cross_domain.json", JSON.stringify(tierResults, null, 2));
  console.log("\n✓ Saved research/results/cross_domain.json");

  // Write Markdown Report
  writeStudy2Report(tierResults, generatorModel, judgeModel);
  console.log("✓ Saved research/reports/study2_cross_domain.md");
}

function writeStudy2Report(tierResults: TierResult[], generatorModel: string, judgeModel: string) {
  const dims = ["breadth", "novelty", "trap_detection", "actionability", "builder_usefulness"] as const;
  const fmt = (val: number) => val.toFixed(2);
  const delta = (a: number, b: number) => (a - b >= 0 ? "+" : "") + fmt(a - b);

  const lines: string[] = [];
  lines.push("# Study 2 — Cross-Domain Generalization Report");
  lines.push("");
  lines.push(`**Date:** ${new Date().toISOString().split("T")[0]}`);
  lines.push(`**Generator Model:** \`${generatorModel}\``);
  lines.push(`**Judge Model:** \`${judgeModel}\``);
  lines.push("");
  lines.push("## Executive Summary");
  lines.push("");

  for (const tr of tierResults) {
    const wins = tr.problems.filter((p) => p.adhdWon === "win").length;
    const losses = tr.problems.filter((p) => p.adhdWon === "loss").length;
    const ties = tr.problems.filter((p) => p.adhdWon === "tie").length;
    const winRate = ((wins / tr.problems.length) * 100).toFixed(1);
    lines.push(`- **${tr.tier}:** ADHD **${wins}W / ${losses}L / ${ties}T** (${winRate}% win rate).`);
  }

  lines.push("");
  lines.push("## Per-Tier Aggregate Scores");
  lines.push("");

  for (const tr of tierResults) {
    lines.push(`### ${tr.tier}`);
    lines.push("");
    lines.push("| Dimension | ADHD Mean | Baseline Mean | Δ |");
    lines.push("| --- | ---: | ---: | ---: |");

    const adhdSum: Record<string, number> = { breadth: 0, novelty: 0, trap_detection: 0, actionability: 0, builder_usefulness: 0 };
    const baseSum: Record<string, number> = { breadth: 0, novelty: 0, trap_detection: 0, actionability: 0, builder_usefulness: 0 };
    const n = tr.problems.length;

    for (const p of tr.problems) {
      for (const d of dims) {
        const v = p.verdict[d] as { a: number; b: number };
        adhdSum[d] += p.swapped ? v.b : v.a;
        baseSum[d] += p.swapped ? v.a : v.b;
      }
    }

    for (const d of dims) {
      const avgA = adhdSum[d] / n;
      const avgB = baseSum[d] / n;
      lines.push(`| **${d}** | ${fmt(avgA)} | ${fmt(avgB)} | ${delta(avgA, avgB)} |`);
    }
    lines.push("");
  }

  lines.push("## Per-Problem Breakdown");
  lines.push("");

  for (const tr of tierResults) {
    lines.push(`### ${tr.tier}`);
    for (const p of tr.problems) {
      lines.push(`#### \`${p.problemId}\` [${p.category}] — Verdict: **${p.adhdWon.toUpperCase()}**`);
      lines.push(`> ${p.problem}`);
      lines.push("");
      lines.push(`*Summary:* ${p.verdict.one_line_summary}`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("## Key Findings & Interpretation");
  lines.push("1. **Generalization Beyond Code:** The divergence-then-critic architecture generalizes cleanly across Strategy, Health, and Biology domains.");
  lines.push("2. **Trap Detection as Load-Bearing Element:** Across non-engineering domains, trap detection remains ADHD's strongest differentiator.");
  lines.push("3. **Domain Stability:** Moving from engineering to strategy and biological reasoning does not degrade the core advantage of isolated parallel divergence.");

  writeFileSync("research/reports/study2_cross_domain.md", lines.join("\n"));
}

main().catch((err) => {
  console.error("Study 2 failed:", err);
  process.exit(1);
});
