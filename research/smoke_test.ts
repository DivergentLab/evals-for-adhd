import { run } from "../src/index.js";
import { renderText } from "../src/render.js";

async function main() {
  console.log("▸ Running smoke test on ADHD harness with Gemini Flash...");

  const problem = "Design a lightweight local caching mechanism for low-latency CLI tools.";

  const startTime = Date.now();
  const result = await run({
    problem,
    framesPerRun: 3,
    ideasPerFrame: 4,
    topK: 2,
    concurrency: 2,
    codeMode: true,
    model: "gemini-2.5-flash",
    onEvent: (e) => console.log(`  event: ${e.kind}`),
  });

  console.log("\n✓ Smoke test finished in", ((Date.now() - startTime) / 1000).toFixed(2), "s");
  console.log("\n--- Output Summary ---");
  console.log("Branches:", result.branches.length);
  console.log("Total Divergent Ideas:", result.branches.reduce((acc, b) => acc + b.ideas.length, 0));
  console.log("Clusters:", result.clusters.length);
  console.log("Traps Flagged:", result.traps.length);
  console.log("Deepened:", result.deepened.length);

  const rendered = renderText(result);
  console.log("\n--- Rendered Excerpt ---");
  console.log(rendered.slice(0, 400) + "...\n");
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
