# Harness Modifications & Audit Log

## 1. Gemini Model Adapter Integration
- **Modification Date:** 2026-07-28
- **Rationale:** The original ADHD harness relied on `@anthropic-ai/claude-agent-sdk`. Per PRD §0.5 Step 4 and user constraints, the harness was extended to natively call Google Gemini API endpoints when `GEMINI_API_KEY` or `GOOGLE_API_KEY` is present.
- **Model Constraints:** Defaulted to `gemini-2.5-flash` and `gemini-3.6-flash` (strictly Flash and Flash-Lite models, non-pro).
- **Files Modified:** `src/llm.ts`
- **Verification:** Verified via `research/smoke_test.ts`.

## 2. Intermediate Logging Infrastructure
- **Modification Date:** 2026-07-28
- **Rationale:** PRD §1 and §0.5 Step 3 require capturing all raw intermediate candidate pools (all N×k divergent ideas, scores, clusters, and deepened outputs) in append-only `.jsonl` log files.
- **Files Added:** `research/smoke_test.ts`, study runner scripts in `research/scripts/`.
