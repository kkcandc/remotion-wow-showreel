import cueFile from "./cues.json";

export const FPS = cueFile.fps;
export const DURATION = cueFile.duration;
export const cues = {
  one: cueFile.one,
  request: cueFile.request,
  sub: cueFile.sub,
  split: cueFile.split,
  parallel: cueFile.parallel,
  lock: cueFile.lock,
  judge: cueFile.judge,
  chart: cueFile.chart,
  points: cueFile.points,
  composite: cueFile.composite,
  best: cueFile.best,
  bestTitle: cueFile.bestTitle,
  bestSub: cueFile.bestSub,
  bestPipe: cueFile.bestPipe,
} as const;

export const color = {
  ink: "#14120f",
  cream: "#f3eee6",
  yellow: "#e4ff3a",
  red: "#ff4b2e",
  creamSoft: "rgba(243,238,230,0.7)",
  creamFaint: "rgba(243,238,230,0.16)",
  inkSoft: "rgba(20,18,15,0.62)",
  inkFaint: "rgba(20,18,15,0.14)",
} as const;

export type Lane = {
  id: string;
  name: string;
  lines: [string, string];
  coverage: number;
  fidelity: number;
  score: number;
};

export const lanes: Lane[] = [
  {
    id: "01",
    name: "ATLAS",
    lines: ["MAP THE", "CONSTRAINT"],
    coverage: 0.3,
    fidelity: 0.8,
    score: 0.66,
  },
  {
    id: "02",
    name: "NOVA",
    lines: ["INVERT", "THE ASK"],
    coverage: 0.48,
    fidelity: 0.62,
    score: 0.71,
  },
  {
    id: "03",
    name: "KESTREL",
    lines: ["PRICE THE", "TRADEOFF"],
    coverage: 0.66,
    fidelity: 0.74,
    score: 0.76,
  },
  {
    id: "04",
    name: "HALO",
    lines: ["KEEP THE", "SIGNAL"],
    coverage: 0.86,
    fidelity: 0.5,
    score: 0.68,
  },
];

export const composite = {
  name: "COMPOSITE",
  coverage: 0.9,
  fidelity: 0.93,
  score: 0.95,
};

export const plotBox = { x: 168, y: 248, w: 980, h: 640 };

export const toPlot = (coverage: number, fidelity: number) => ({
  x: plotBox.x + coverage * plotBox.w,
  y: plotBox.y + (1 - fidelity) * plotBox.h,
});

export const curve = {
  start: { coverage: 0.06, fidelity: 0.2 },
  c1: { coverage: 0.32, fidelity: 0.78 },
  c2: { coverage: 0.58, fidelity: 0.99 },
  end: { coverage: composite.coverage, fidelity: composite.fidelity },
};
