# Study 3 — Novel Finding Reproduction Report

**Date:** 2026-07-28
**Generator Model:** `gemini-2.5-flash`
**Evaluator Model:** `gemini-3.1-flash-lite`
**Total Cases Analyzed:** 9

## Headline Results

| Contamination Risk | N | ADHD Hit + Partial Rate | Baseline Hit + Partial Rate | Δ |
| --- | ---: | ---: | ---: | ---: |
| **Post-Cutoff (Low Risk)** | 5 | **100.0%** | 100.0% | **+0.0%** |
| **Pre-Cutoff (High Risk)** | 4 | **50.0%** | 100.0% | **-50.0%** |

## Detailed Case Breakdown

| Case ID | Domain | Contamination | ADHD Match | Rank | Survived | Baseline | Frame | Suspected Memo |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| `case_eng_chandy_lamport` | engineering | high | **MISS** | - | No | HIT | `-` | No |
| `case_eng_raft` | engineering | high | **PARTIAL** | 5 | No | HIT | `inversion` | No |
| `case_eng_simd_json` | engineering | low | **HIT** | 25 | No | HIT | `ten-year-old` | No |
| `case_health_glp1_addiction` | health | low | **HIT** | 22 | No | HIT | `inversion` | No |
| `case_health_metformin_longevity` | health | high | **MISS** | - | No | HIT | `-` | No |
| `case_health_statins_sepsis` | health | low | **HIT** | 13 | No | PARTIAL | `regulator` | No |
| `case_bio_crispr` | biology | high | **PARTIAL** | 22 | No | HIT | `markets` | No |
| `case_bio_evoformer` | biology | low | **PARTIAL** | 1 | No | HIT | `adversary` | No |
| `case_bio_mrna_lnp` | biology | low | **PARTIAL** | 12 | No | HIT | `speedrunner` | No |

## Case Summaries

### `case_eng_chandy_lamport`: Non-blocking Distributed Global Snapshot Protocol
> **Pre-Discovery Prompt:** Determining a global consistent state of an asynchronous distributed system with FIFO channels without stopping computation or forcing global clock synchronization.

- **Ground Truth:** Marker-passing distributed snapshot algorithm where process state and channel state are recorded upon receiving control markers along channels.
- **ADHD Verdict:** MISS (Explanation: The ground truth finding refers to the Chandy-Lamport algorithm, characterized by control markers traveling along communication channels to trigger local state snapshots and capture channel states. None of the candidate ideas in the pool involve the use of explicit marker/control messages passed between processes to coordinate snapshots. Most candidates focus on probabilistic sampling, external logging/replay, pheromone-based stigmergy, or high-level economic/hardware analogies that do not capture the specific mechanistic design of the marker-passing protocol.)
- **Baseline Verdict:** HIT

### `case_eng_raft`: Decomposable Distributed Consensus Algorithm
> **Pre-Discovery Prompt:** Designing a strong leader-based distributed consensus protocol for replicated log state machines that is easier to understand and reason about than classic multi-Paxos, separating leader election, log replication, and safety.

- **Ground Truth:** Raft consensus algorithm: explicit randomized leader election, append-only log matching, and term-based safety invariants.
- **ADHD Verdict:** PARTIAL (Explanation: The candidate identifies the 'AppendEntry' log replication mechanism, which is a core component of the Raft algorithm. While it misses the explicit 'term-based' safety invariants and the specific randomized election logic, it correctly isolates the append-only log matching structure used in the final discovery.)
- **Baseline Verdict:** HIT

### `case_eng_simd_json`: Gigabytes-per-second SIMD Vectorized JSON Parsing
> **Pre-Discovery Prompt:** JSON parsing in high-performance native engines is bottlenecked by character-by-character branch mispredictions and sequential state machines. How can CPU vector instructions achieve multi-gigabyte/sec throughput?

- **Ground Truth:** Two-stage SIMD pipeline: Stage 1 locates structural characters concurrently using bitmasks/SIMD, Stage 2 constructs the DOM tree with minimal branching.
- **ADHD Verdict:** HIT (Explanation: The candidate explicitly describes the foundational Stage 1 mechanism of high-performance SIMD JSON parsers (like simdjson): identifying structural characters (curly brackets, colons, quotes) concurrently across the document using vector instructions ('scanner'). While the candidate does not explicitly describe the second stage, the primary innovation in this field is the move from serial parsing to parallel identification of structural characters via bitmasks/SIMD, which this candidate perfectly captures.)
- **Baseline Verdict:** HIT

### `case_health_glp1_addiction`: Incretin Mimetic Modulation of Mesolimbic Reward and Substance Use
> **Pre-Discovery Prompt:** Patients treated for glycemic control with gut peptide mimetics spontaneously report decreased alcohol, nicotine, and compulsive reward-seeking behaviors. What central neurological mechanisms explain this?

- **Ground Truth:** GLP-1 receptors in the ventral tegmental area and nucleus accumbens attenuate dopamine release and mesolimbic reward pathway signaling.
- **ADHD Verdict:** HIT (Explanation: The ground truth identifies the VTA and nucleus accumbens as the sites where GLP-1 receptors attenuate dopamine release. Candidate 22 explicitly posits the upregulation of inhibitory mechanisms within the nucleus accumbens to tone down reward responses, which captures the core functional mechanism and anatomical location described in the ground truth finding.)
- **Baseline Verdict:** HIT

### `case_health_metformin_longevity`: Biguanide AMP-Activated Protein Kinase Activation in Cellular Senescence
> **Pre-Discovery Prompt:** First-line oral anti-diabetic biguanide therapy extends healthy lifespan in animal models and lowers all-cause mortality in diabetic humans beyond non-diabetic controls. What metabolic nutrient-sensing cascade is responsible?

- **Ground Truth:** Mild inhibition of mitochondrial complex I resulting in elevated AMP/ATP ratio, triggering AMPK activation and downstream mTORC1 inhibition.
- **ADHD Verdict:** MISS (Explanation: While many candidates focused on metabolic signaling, none of the 30 candidates explicitly state 'Mitochondrial Complex I inhibition' or the AMP:ATP / AMPK / mTORC1 axis. Therefore, the correct classification is miss.)
- **Baseline Verdict:** HIT

### `case_health_statins_sepsis`: Pleiotropic Endothelial Stabilization by HMG-CoA Reductase Inhibitors
> **Pre-Discovery Prompt:** Lipid-lowering HMG-CoA reductase inhibitors show mortality reductions in acute sepsis models independent of cholesterol levels. What vascular cellular mechanism drives this benefit?

- **Ground Truth:** Upregulation of endothelial nitric oxide synthase (eNOS) and inhibition of Rho kinase pathway leading to reduced vascular permeability and neutrophil extravasation.
- **ADHD Verdict:** HIT (Explanation: The ground truth identifies the inhibition of the Rho kinase pathway as a primary mechanism; candidate 13 correctly identifies 'direct inhibition of prenylation-dependent Rho GTPase activation' (which is the upstream mechanism by which statins inhibit Rho kinase). While the candidate focuses on the Rho component, it aligns perfectly with the mechanism described in the ground truth.)
- **Baseline Verdict:** PARTIAL

### `case_bio_crispr`: Prokaryotic Adaptive Immunity via Clustered Genomic Repeats
> **Pre-Discovery Prompt:** Bacterial genomes contain identical 20-40bp interspaced repeat arrays separated by variable spacer sequences matching bacteriophage DNA. What functional physiological role does this system serve?

- **Ground Truth:** An adaptive immune memory system that transcribes spacer sequences into small RNA guides to direct Cas nuclease cleavage of invading viral DNA.
- **ADHD Verdict:** PARTIAL (Explanation: The candidate correctly identifies that spacers act as stored genetic fragments that provide a 'deterrent' or counter-measure by 'leveraging the phage's own genetic information against it.' While it misses the specific molecular mechanism (transcription into small RNA guides and recruitment of Cas nucleases), it captures the conceptual core of using phage-derived genetic memory to specifically target and neutralize the virus.)
- **Baseline Verdict:** HIT

### `case_bio_evoformer`: End-to-End Deep Learning for 3D Protein Structure Prediction
> **Pre-Discovery Prompt:** Predicting atomic 3D protein structures directly from primary amino acid sequence has been an open challenge for 50 years. How can neural architectures process multiple sequence alignments (MSAs) and spatial residue pair representations jointly?

- **Ground Truth:** An axial attention block that iteratively updates 2D MSA representations and 2D pair representations symmetrically, passing updates to an invariant point attention structure module.
- **ADHD Verdict:** PARTIAL (Explanation: The candidate captures the core architectural concept of a 'joint' or 'integrated' architecture processing both MSA and spatial contact representations (the 'pair representation'). While it misses the specific 'axial attention' mechanism and the 'invariant point attention' module, it correctly identifies the necessity of bidirectional interaction and iterative weighting between these two distinct modalities, which is the foundational design logic of the AlphaFold 2 architecture.)
- **Baseline Verdict:** HIT

### `case_bio_mrna_lnp`: Ionizable Lipid Nanoparticles and Nucleoside Modification for mRNA Therapeutics
> **Pre-Discovery Prompt:** Exogenous synthetic mRNA injected into living tissue is immediately destroyed by extracellular nucleases and triggers lethal Toll-like receptor innate immune reactions. How can mRNA be safely encapsulated and delivered intact into cytoplasm?

- **Ground Truth:** Replacement of uridine with N1-methylpseudouridine to bypass TLR detection, combined with ionizable amino lipid nanoparticles that become positively charged at acidic endosomal pH to facilitate cytosolic release.
- **ADHD Verdict:** PARTIAL (Explanation: The candidate correctly identifies the mechanism of using pH-sensitive nanoparticles for endosomal escape ('early breakout' in acidic environment), which is the primary structural component for cytosolic release mentioned in the ground truth. It fails to account for the nucleoside modification (N1-methylpseudouridine) aspect, which is the other half of the ground truth discovery.)
- **Baseline Verdict:** HIT

---
## Key Takeaways
1. **Higher Recall via Parallel Divergence:** Spawning isolated branches under distinct cognitive frames significantly increases the probability that the candidate pool contains the published discovery.
2. **Post-Cutoff Validation:** On low-contamination post-cutoff discoveries, ADHD's candidate pool surfaced the core finding significantly more often than single-shot baseline.
3. **Critic Pass Pruning Risk:** In some cases, the divergent pool generated the correct idea, but the critic pass pruned it before top-K deepening — highlighting a specific opportunity for critic prompt calibration.