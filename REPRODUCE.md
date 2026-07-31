# Reproducing the Phase 2 results

[← back to README](./README.md)

This walks through getting from a clean clone to the exact numbers in the [README](./README.md) and [`findings/`](./findings). It's split into two paths because they mean different things:

- **Read the checked-in results** — zero setup, zero API calls, byte-identical to what's published. Do this first.
- **Re-run the studies yourself** — requires a Gemini API key, costs money, takes time, and — because these are LLM calls — will **not** reproduce bit-identical numbers. Read the [nondeterminism](#nondeterminism-what-exact-reproduction-actually-means-here) section before you do this so you're not surprised.

---

## Path 1: Read the checked-in results (no setup)

Every number in the README traces to a file already in this repo. No install, no API key, no run required.

```
research/
  problems/    # exact prompts used for Studies 1 & 2 — nothing hidden
  cases/       # the 9 discovery cases for Study 3: pre-discovery prompts + ground truth
  logs/        # raw, append-only LLM call logs — one .jsonl file per run, every candidate idea and verdict
  results/     # aggregated, machine-readable scoring output (*.json) — same content as findings/*.json
  reports/     # full human-readable writeup per study — same content as findings/study*.md
findings/      # the public-facing copies of the above, linked from the README
```

`research/results/*.json` and `findings/*.json` are identical (same for `research/reports/*.md` and `findings/study*.md`) — `findings/` is just the checked-in publication copy. To confirm:

```bash
diff research/results/cross_model.json findings/cross_model.json
diff research/reports/study1_cross_model.md findings/study1_cross_model.md
```

Both should print nothing. If you just want to verify a specific number in the README, open the matching file in `findings/` — that's the ground truth, not the scripts.

---

## Path 2: Re-run the studies

### 1. Install ADHD

```bash
git clone https://github.com/DivergentLab/evals-for-adhd.git
cd evals-for-adhd
npm install
npm run build
```

Requires Node.js >= 18. This builds the `adhd` engine (`src/`) and the CLI that the research scripts import directly — you don't need to `npm install -g adhd-agent` separately, the scripts import from `src/` in this same repo.

### 2. Set up an API key

All four studies were generated and judged with Google Gemini models (`gemini-2.5-flash` as generator, `gemini-2.5-flash` / `gemini-3.1-flash-lite` as judges). Create a `.env` file in the repo root:

```
GEMINI_API_KEY=your-key-here
```

(`GOOGLE_API_KEY` also works.) [`src/llm.ts`](./src/llm.ts) auto-loads `.env` on any script run. If no Gemini key is present, `callLLM` falls back to the Claude Agent SDK — which will run, but **will not match the published numbers**, since none of the Phase 2 studies used Claude as generator or judge. Use a Gemini key if you want anything comparable to the published results.

### 3. Run the studies

The research scripts aren't wired into `package.json` — invoke them directly with `tsx`:

```bash
npx tsx research/scripts/run_study1.ts   # Cross-model judging — 12 problems, no caching, always fresh
npx tsx research/scripts/run_study2.ts   # Cross-domain — 18 problems, resumes from cached logs
npx tsx research/scripts/run_study3.ts   # Finding reproduction — 9 cases, resumes from cached logs
npx tsx research/scripts/run_study4.ts   # Frame ablation — pure aggregation, no new LLM calls, no key needed
npx tsx research/scripts/generate_phase2_summary.ts  # Rolls 1-4 into research/reports/phase2_summary.md
```

Each writes its aggregate JSON to `research/results/`, its full report to `research/reports/`, and (for Studies 1-3) its raw per-problem log to `research/logs/<study>/<timestamped-file>.jsonl`.

**Important — Studies 2 and 3 cache, Study 1 does not.** Before you run anything, know what's already sitting in `research/logs/`:

| Study | Resume behavior | What happens on a fresh clone |
| --- | --- | --- |
| 1 (cross-model) | None — always makes fresh API calls for all 12 problems | Writes a **new** timestamped log file every run. The checked-in logs directory already has 2 runs in it (from the original benchmark). Running it again adds a 3rd. |
| 2 (cross-domain) | Resumes from the newest `.jsonl` in `research/logs/study2_cross_domain/`, skipping any `problemId` already logged | Since that log already has all 18 problems, a fresh run makes **zero** new API calls — it just replays the cached records into `research/results/cross_domain.json` |
| 3 (finding reproduction) | Same resume-by-ID behavior, against `research/logs/study3_finding_repro/` | Same as above — all 9 cases already cached, zero new calls on a stock clone |
| 4 (frame ablation) | N/A — reads every `.jsonl` file in the Study 1-3 log directories and aggregates | No LLM calls at all |

So on a clean clone, running the full pipeline in order costs you exactly one fresh Study 1 run (12 problems × 2 judges, plus each ADHD branch's own frame/critic/deepen calls — order of a few hundred Gemini calls) and nothing else, because Studies 2 and 3 just replay what's already checked in.

### The "51 runs" figure, explained

Study 4's report and the README both cite **51 problem runs** across the 4 studies. That number only reconciles because `research/logs/study1_cross_model/` holds **two** separate historical runs (12 + 12 problems) alongside Study 2 (18) and Study 3 (9): 12 + 12 + 18 + 9 = 51. Study 1 has no dedup, so Study 4 (which naively aggregates every `.jsonl` file in those three log directories) counts both.

If you run Study 1 again before running Study 4, you'll add a third 12-problem log file, and Study 4's aggregate will shift to 63 runs instead of 51 — not because anything broke, just because Study 1's fresh-run-every-time design and Study 4's no-dedup aggregation compound. If you want Study 4 to match the published 51-run table exactly, either don't re-run Study 1, or move/rename its extra log files out of `research/logs/study1_cross_model/` before running Study 4.

---

## Nondeterminism: what "exact reproduction" actually means here

These are LLM calls, not a deterministic pipeline. Re-running Study 1 will **not** reproduce the exact same baseline text, ADHD candidate pool, or judge verdicts — Gemini sampling, the random A/B position swap in each judging pass, and model version drift over time all mean individual outputs differ run to run. What we'd actually expect to hold up on a re-run:

- The **aggregate pattern** — ADHD ahead on breadth/novelty/trap-detection, behind on actionability/builder-usefulness, by a similar margin.
- The **rough win rate** (2-4 out of 12 for Study 1) — not necessarily the exact 2/12 or 4/12.
- The **qualitative Study 3 result** — most post-cutoff cases hitting, some pre-cutoff cases partial-or-missing — not necessarily the exact same rank-in-pool numbers for each case.

If a re-run gives you a meaningfully different picture (e.g. ADHD losing on novelty, or 0/9 on Study 3), that's a real signal worth investigating — but a few points of win-rate drift or a case flipping from MISS to PARTIAL is expected sampling noise, not a broken benchmark.

To get numbers that match the README exactly, use [Path 1](#path-1-read-the-checked-in-results-no-setup) — read `findings/` directly, don't re-run.

---

## Auditing a specific result

Every scored comparison traces back to a raw call. To check a specific README claim against source:

1. Find the study's `.md` report in `findings/` for the case-by-case reasoning (e.g. [`findings/study3_finding_reproduction.md`](./findings/study3_finding_reproduction.md)).
2. Find the matching `.json` in `findings/` for the structured record.
3. Find the raw `.jsonl` log in `research/logs/<study>/` for the actual prompts sent and text returned, unedited, in call order.

Nothing in `findings/` is hand-edited from what the scripts produced — the reports are generated directly by each `run_study*.ts` script's report-writer function.
