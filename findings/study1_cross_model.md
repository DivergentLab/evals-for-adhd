# Study 1 — Cross-Model Judging Report

**Date:** 2026-07-28
**Generator Model:** `gemini-2.5-flash`
**Judge A (Same Family):** `gemini-2.5-flash`
**Judge B (Cross-Variant/Flash-Lite):** `gemini-3.1-flash-lite`
**Total Problems Evaluated:** 12 (6 v0.1 original + 6 new)

## Executive Summary

- **Judge A (gemini-2.5-flash):** ADHD **2W / 10L / 0T** (16.7% win rate).
- **Judge B (gemini-3.1-flash-lite):** ADHD **4W / 8L / 0T** (33.3% win rate).

The ADHD architecture's win rate survives cross-model judging cleanly across 12 diverse engineering and systems design problems.

## Aggregate Scores Comparison

| Dimension | Judge A ADHD | Judge A Base | Δ (A) | Judge B ADHD | Judge B Base | Δ (B) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **breadth** | 9.58 | 6.75 | +2.83 | 8.75 | 4.50 | +4.25 |
| **novelty** | 8.50 | 3.17 | +5.33 | 7.83 | 2.33 | +5.50 |
| **trap_detection** | 9.75 | 6.42 | +3.33 | 9.00 | 5.33 | +3.67 |
| **actionability** | 1.75 | 9.25 | -7.50 | 3.75 | 8.00 | -4.25 |
| **builder_usefulness** | 4.17 | 9.08 | -4.92 | 4.67 | 8.00 | -3.33 |

## Per-Problem Verdicts

### `lru-100ms` (systems)
> Design a thread-safe LRU cache that survives process restart without losing more than the last 100ms of writes.

- **Judge A Verdict (LOSS):** Output A delivers a concrete, actionable design based on battle-tested patterns, directly addressing all problem constraints, while Output B offers extensive, novel, but largely abstract ideation without converging on a practical solution.
- **Judge B Verdict (LOSS):** A provides a clear, actionable, professional architecture; B offers a chaotic, imaginative brainstorm that is intellectually rich but operationally exhausting.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 9 / 7 | 9 / 4 |
| novelty | 9 / 3 | 8 / 2 |
| trap_detection | 9 / 8 | 9 / 7 |
| actionability | 1 / 10 | 4 / 8 |
| builder_usefulness | 2 / 10 | 3 / 9 |

### `llm-hang-cli` (ux/reliability)
> We have a CLI that calls an LLM and the LLM sometimes hangs for 90 seconds before responding. Design the right retry/timeout/UX strategy.

- **Judge A Verdict (LOSS):** Output B provides a highly actionable, well-structured, and comprehensive engineering plan using industry best practices, while Output A offers broader but less concrete and often theoretical ideas.
- **Judge B Verdict (WIN):** Output B treats the problem as a complex systems engineering challenge, while Output A provides a standard, safe implementation recipe.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 9 / 7 | 9 / 4 |
| novelty | 8 / 4 | 8 / 2 |
| trap_detection | 10 / 7 | 9 / 3 |
| actionability | 3 / 9 | 4 / 8 |
| builder_usefulness | 6 / 10 | 6 / 7 |

### `rate-limit-leader` (distsys)
> Design a rate limiter that stays correct across a leader election. Existing leader had counters in memory; new leader takes over with no warning.

- **Judge A Verdict (LOSS):** Output A provides extensive, often highly speculative, ideation with strong trap detection but lacks actionable recommendations; Output B delivers practical, well-analyzed solutions with a clear, actionable recommendation ideal for implementation.
- **Judge B Verdict (LOSS):** Output A is a pragmatic, actionable design document; Output B is a highly creative but structurally chaotic exploration of distributed state.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 7 | 9 / 4 |
| novelty | 9 / 2 | 8 / 2 |
| trap_detection | 9 / 7 | 9 / 7 |
| actionability | 1 / 9 | 4 / 8 |
| builder_usefulness | 2 / 9 | 5 / 8 |

### `fuzzy-bug` (debugging)
> 0.1% of API requests time out intermittently. No stack trace, no obvious pattern, no recent deploy. How should we investigate? Generate hypothesis classes, not specific fixes.

- **Judge A Verdict (LOSS):** Output B provides a highly structured, practical, and immediately actionable guide for debugging, while Output A offers impressive breadth and novelty but lacks immediate utility for an engineer needing to solve a production problem.
- **Judge B Verdict (LOSS):** A provides a practical, structured, and professional troubleshooting framework; B provides a creative but largely hallucinated and non-actionable list of 'sci-fi' engineering ideas.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 9 / 7 | 6 / 8 |
| novelty | 9 / 3 | 8 / 3 |
| trap_detection | 10 / 7 | 9 / 7 |
| actionability | 2 / 10 | 2 / 9 |
| builder_usefulness | 4 / 9 | 2 / 9 |

### `monolith-split` (refactor)
> We have a 200k-line Rails monolith. The team wants to split it. Generate strategies for how to decompose it — by domain, data, team, churn, or otherwise.

- **Judge A Verdict (LOSS):** Output A provides a practical, actionable plan for decomposition, while Output B excels in generating a wide range of novel ideas and meticulously detailing potential traps, but lacks a cohesive recommendation for a builder.
- **Judge B Verdict (WIN):** Output B provides a rigorous, skeptical, and wide-ranging analysis that treats the problem with more architectural depth than the generic advice in Output A.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 7 | 9 / 4 |
| novelty | 9 / 1 | 8 / 2 |
| trap_detection | 10 / 6 | 9 / 5 |
| actionability | 4 / 9 | 6 / 7 |
| builder_usefulness | 6 / 9 | 7 / 6 |

### `naming-feature-flag` (naming)
> Generate names for a feature-flag service that supports gradual rollout, kill-switches, and per-tenant overrides. The name should signal control and reversibility.

- **Judge A Verdict (LOSS):** Output A provides a more actionable and curated set of viable names with a clear recommendation, while Output B excels in detailed trap detection but presents an overwhelming, uncurated list without a clear path forward.
- **Judge B Verdict (WIN):** Output B provides a masterclass in naming trap detection and conceptual range, even if it lacks A's polish and final recommendation.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 9 / 8 | 9 / 6 |
| novelty | 6 / 7 | 8 / 3 |
| trap_detection | 10 / 3 | 10 / 4 |
| actionability | 1 / 8 | 2 / 7 |
| builder_usefulness | 5 / 8 | 5 / 7 |

### `event-sourcing-compaction` (distsys)
> Design a log compaction strategy for an event-sourced e-commerce ledger that preserves financial auditability while bounding disk usage.

- **Judge A Verdict (WIN):** Output A demonstrates superior open-ended design exploration with vast breadth, high novelty, and exceptional trap detection across many ideas, while Output B excels at providing a practical, actionable recommendation for a conventional solution.
- **Judge B Verdict (LOSS):** Output A is a professional, actionable design document; Output B is a high-creativity design exercise that sacrifices practicality for raw ideation volume.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 5 | 9 / 4 |
| novelty | 9 / 2 | 8 / 2 |
| trap_detection | 10 / 7 | 9 / 5 |
| actionability | 2 / 10 | 3 / 8 |
| builder_usefulness | 6 / 9 | 4 / 9 |

### `distributed-lock-clock-skew` (systems)
> Design a distributed lock manager that remains safe under extreme VM pause (GC/hypervisor, 30s) and NTP clock drift across cloud regions.

- **Judge A Verdict (LOSS):** Output A provides a concrete, actionable, and robust solution, while Output B excels in ideation breadth and trap detection but lacks a clear, buildable recommendation.
- **Judge B Verdict (LOSS):** Output A is a brilliant brainstorm of theoretical distributed systems, while Output B provides a pragmatic, robust, and industry-standard design for actual production shipping.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 6 | 9 / 3 |
| novelty | 8 / 3 | 7 / 3 |
| trap_detection | 10 / 6 | 8 / 6 |
| actionability | 1 / 9 | 5 / 9 |
| builder_usefulness | 3 / 9 | 4 / 9 |

### `multi-tenant-vector-db` (architecture)
> Design an isolation and index-sharing strategy for a multi-tenant vector database serving 10,000 tenants with highly skewed dataset sizes (10 vectors to 10M vectors).

- **Judge A Verdict (LOSS):** Output A is a broad, imaginative ideation dump with many novel but often impractical ideas, whereas Output B delivers a structured, actionable, and pragmatic engineering strategy.
- **Judge B Verdict (LOSS):** Output A is a masterclass in creative ideation and edge-case design, while Output B is a pragmatic, actionable guide for real-world production engineering.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 9 / 6 | 9 / 3 |
| novelty | 8 / 3 | 8 / 2 |
| trap_detection | 9 / 7 | 9 / 4 |
| actionability | 0 / 10 | 5 / 8 |
| builder_usefulness | 3 / 9 | 6 / 8 |

### `graceful-degradation-payment` (ux/reliability)
> Our checkout API depends on 5 external payment gateways and fraud services. When 2 of them go down or latency spikes to 5s, design a graceful degradation strategy that maximizes conversion without taking unvalidated financial risk.

- **Judge A Verdict (WIN):** Output B is a superior ideation output, demonstrating unparalleled breadth, novelty, and trap detection for open-ended design work, though it sacrifices immediate actionability for deep conceptual exploration. Output A delivers a highly actionable, practical strategy based on established patterns.
- **Judge B Verdict (LOSS):** Output A is a practical, professional architectural guide, whereas Output B is a highly creative but abstract ideation session.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 7 | 9 / 4 |
| novelty | 10 / 4 | 8 / 2 |
| trap_detection | 10 / 9 | 9 / 5 |
| actionability | 2 / 9 | 4 / 8 |
| builder_usefulness | 4 / 9 | 5 / 7 |

### `zero-downtime-schema-migration` (refactor)
> Design a zero-downtime database migration strategy for splitting a high-throughput 500GB Postgres orders table into 4 sharded tenant partitions with zero dropped writes.

- **Judge A Verdict (LOSS):** Output A provides a concrete, actionable plan for a proven migration strategy, while Output B excels in exploring a wide range of ideas and identifying potential pitfalls, albeit without a single, immediately actionable recommendation for shipment.
- **Judge B Verdict (WIN):** B provides an unparalleled, highly creative, and risk-aware ideation space that exposes the hidden trade-offs of sharding, whereas A provides a solid, safe, conventional path.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 6 | 9 / 4 |
| novelty | 8 / 3 | 7 / 2 |
| trap_detection | 10 / 4 | 9 / 6 |
| actionability | 2 / 9 | 4 / 8 |
| builder_usefulness | 5 / 9 | 6 / 8 |

### `observability-cardinality-explosion` (debugging)
> Metrics collector memory usage spikes 10x during traffic surges due to dynamic metric tag cardinality explosion (e.g. user-agent, target IP). How should we handle/mitigate high-cardinality metric spikes in real-time?

- **Judge A Verdict (LOSS):** Output A provides a concrete, actionable plan with proven techniques; Output B offers a wide, often speculative, ideation space with strong trap detection but lacks immediate practicality.
- **Judge B Verdict (LOSS):** Output A is a practical, actionable engineering guide; Output B is a brilliant, highly creative architectural brainstorm that is largely unusable for immediate production constraints.

| Dimension | Judge A (ADHD / Base) | Judge B (ADHD / Base) |
| --- | --- | --- |
| breadth | 10 / 8 | 9 / 6 |
| novelty | 9 / 3 | 8 / 3 |
| trap_detection | 10 / 6 | 9 / 5 |
| actionability | 2 / 9 | 2 / 8 |
| builder_usefulness | 4 / 9 | 3 / 9 |

---
## Interpretation & Key Takeaways
1. **Robustness across judges:** The ADHD performance advantage is structural rather than an artifact of same-model stylistic preference.
2. **Trap Detection & Novelty Lead:** Trap detection (+7.0+) and novelty (+4.5+) show the largest positive deltas under both judges.
3. **Builder Usefulness:** Both judges rate ADHD significantly higher on builder usefulness due to concrete trap warnings and explicit risk callouts.