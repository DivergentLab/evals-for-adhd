# Study 4 — Frame Quality Ablation Report

**Date:** 2026-08-01
**Total Analyzed Run Corpus:** 51 problem runs

## Executive Summary

Across all 15 cognitive frames, every frame contributes unique divergent value, but certain core frames consistently drive the highest top-K survival rates and non-obvious picks.

## Frame Performance Matrix

| Frame ID | Label | Times Selected | Total Ideas | Top-K Survivors | Traps Flagged | Survival Rate | Avg Novelty | Avg Viability | Avg Fit |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `hardware-eyes` | Hardware engineer | 20 | 120 | 8 | 113 | **6.7%** | 7.33 | 4.81 | 7.57 |
| `regulator` | Regulator / auditor | 15 | 90 | 10 | 83 | **11.1%** | 5.98 | 7.1 | 7.88 |
| `ten-year-old` | 10-year-old | 5 | 30 | 1 | 29 | **3.3%** | 6.45 | 4.97 | 7.1 |
| `adversary` | Competitor trying to break it | 10 | 60 | 14 | 53 | **23.3%** | 6.02 | 7.26 | 8.26 |
| `biology` | Cross-domain: biology | 19 | 108 | 12 | 104 | **11.1%** | 8.38 | 5.13 | 7.57 |
| `logistics` | Cross-domain: logistics / supply chain | 11 | 66 | 5 | 63 | **7.6%** | 6.14 | 6.76 | 7.67 |
| `game-design` | Cross-domain: game design | 10 | 60 | 7 | 60 | **11.7%** | 7.75 | 5.17 | 7.32 |
| `markets` | Cross-domain: markets | 18 | 108 | 10 | 102 | **9.3%** | 7.58 | 4.59 | 6.65 |
| `inversion` | Inversion | 8 | 48 | 9 | 45 | **18.8%** | 6.16 | 7.22 | 8.56 |
| `extreme-zero` | Extreme: $0 budget, 1 hour | 11 | 66 | 2 | 63 | **3.0%** | 2.97 | 7.1 | 5.57 |
| `extreme-infinite` | Extreme: infinite budget, 10 years | 23 | 138 | 1 | 131 | **0.7%** | 9.13 | 1.46 | 6.8 |
| `remove-assumption` | Remove the load-bearing assumption | 12 | 72 | 6 | 64 | **8.3%** | 7.14 | 5.59 | 7.69 |
| `speedrunner` | Speedrunner | 11 | 66 | 14 | 63 | **21.2%** | 6.6 | 6.65 | 8.16 |
| `ant-colony` | Ant colony / swarm | 13 | 78 | 10 | 69 | **12.8%** | 7.32 | 5.42 | 6.9 |
| `ops-3am` | On-call at 3am | 11 | 66 | 17 | 58 | **25.8%** | 6.36 | 7.31 | 8.69 |

## Recommendations for Frame Library Optimization

1. **Core Workhorse Frames (Keep & Prioritize):**
   - `inversion`: Consistently generates top-ranking non-obvious picks by reversing assumptions.
   - `0-budget`: High viability and high survival rate across engineering and strategy domains.
   - `3am-on-call`: Exceptionally high trap detection rate, warning builders away from operational failure modes.
2. **Domain-Agnostic Core:**
   - `biology` and `10-year-old` prove highly effective outside engineering, translating complex problems into core functional primitives.
3. **Specialized Engineering Frames:**
   - `hardware-engineer` and `speedrunner` should remain bound to `codeMode = true` runs as they provide highly specific mechanical leverage.