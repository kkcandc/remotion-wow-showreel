#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const preview = process.argv.includes("--preview");
const output = preview ? "preview/showreel.mp4" : "out/showreel.mp4";
mkdirSync(preview ? "preview" : "out", { recursive: true });

const render = spawnSync(
  "npx",
  [
    "remotion",
    "render",
    "Showreel",
    output,
    "--codec=h264",
    `--crf=${preview ? "20" : "16"}`,
    "--concurrency=4",
    "--pixel-format=yuv420p",
  ],
  { stdio: "inherit" },
);

if (render.status !== 0) {
  process.exit(render.status ?? 1);
}

if (preview) {
  const still = spawnSync(
    "npx",
    ["remotion", "still", "Showreel", "preview/poster.png", "--frame=820", "--scale=1"],
    { stdio: "inherit" },
  );
  process.exit(still.status ?? 1);
}
