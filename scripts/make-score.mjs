import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cues = JSON.parse(readFileSync(join(root, "src/cues.json"), "utf8"));

const sr = 44100;
const seconds = cues.duration / cues.fps;
const n = Math.floor(sr * seconds);
const L = new Float32Array(n);
const R = new Float32Array(n);
const kickEnv = new Float32Array(n);
const padL = new Float32Array(n);
const padR = new Float32Array(n);

const frameToSample = (frame) => Math.round((frame / cues.fps) * sr);

const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const noiseAt = (i) => mulberry32((i * 1664525 + 1013904223) >>> 0)() * 2 - 1;

const addKick = (frame, amp = 0.85) => {
  const start = frameToSample(frame);
  let phase = 0;
  const len = Math.floor(sr * 0.38);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const freq = 48 + 128 * Math.exp(-t * 22);
    phase += (2 * Math.PI * freq) / sr;
    const body = Math.sin(phase) * Math.exp(-t * 7.2) * amp;
    const click = noiseAt(start + i) * Math.exp(-t * 180) * 0.16 * amp;
    const idx = start + i;
    if (idx >= n) break;
    L[idx] += body + click;
    R[idx] += body + click;
    kickEnv[idx] = Math.max(kickEnv[idx], Math.exp(-t * 12) * amp);
  }
};

const addSnare = (frame, amp = 0.28) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * 0.18);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const white = noiseAt(start + i * 3);
    const hp = white - prev;
    prev = white;
    const env = Math.exp(-t * 18) * (0.65 + 0.35 * Math.exp(-t * 80));
    const tone = Math.sin(2 * Math.PI * 196 * t) * Math.exp(-t * 28) * 0.35;
    const idx = start + i;
    if (idx >= n) break;
    const v = (hp * 0.75 + tone) * env * amp;
    L[idx] += v * 0.92;
    R[idx] += v;
  }
};

const addHat = (frame, amp = 0.06) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * 0.045);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const white = noiseAt(start * 2 + i * 5);
    const hp = white - prev;
    prev = white;
    const idx = start + i;
    if (idx >= n) break;
    const v = hp * Math.exp(-t * 80) * amp;
    L[idx] += v * 0.75;
    R[idx] += v;
  }
};

const addBass = (frame, freq, amp = 0.2, hold = 0.24) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * hold);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    phase += (2 * Math.PI * freq) / sr;
    const env = Math.min(1, t * 90) * Math.exp(-t * 5.5);
    const idx = start + i;
    if (idx >= n) break;
    const duck = 1 - Math.min(1, kickEnv[idx]) * 0.72;
    const v = (Math.sin(phase) + Math.sin(phase * 2) * 0.15) * env * amp * duck;
    L[idx] += v;
    R[idx] += v;
  }
};

const addPing = (frame, freq, amp = 0.14, decay = 12) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * 0.45);
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    phase += (2 * Math.PI * freq) / sr;
    const idx = start + i;
    if (idx >= n) break;
    const v = Math.sin(phase) * Math.exp(-t * decay) * amp * Math.min(1, t * 200);
    L[idx] += v;
    R[idx] += v * 0.86;
  }
};

const addBurst = (frame, amp, hold) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * hold);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    const white = noiseAt(900000 + start + i);
    const hp = white - prev;
    prev = white;
    const idx = start + i;
    if (idx >= n) break;
    const v = hp * Math.exp(-t * 10) * amp;
    L[idx] += v;
    R[idx] += v * 0.9;
  }
};

const addPad = (frame, freq, amp, hold, pan) => {
  const start = frameToSample(frame);
  const len = Math.floor(sr * hold);
  let phase = 0;
  let phase2 = 0;
  const detune = freq * 1.006;
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    phase += (2 * Math.PI * freq) / sr;
    phase2 += (2 * Math.PI * detune) / sr;
    const attack = Math.min(1, t / 0.35);
    const release = Math.max(0, Math.min(1, (hold - t) / 0.55));
    const idx = start + i;
    if (idx >= n) break;
    const v = (Math.sin(phase) * 0.62 + Math.sin(phase2) * 0.38) * attack * release * amp;
    padL[idx] += v * (1 - pan);
    padR[idx] += v * (0.35 + pan);
  }
};

const addRiser = (startFrame, endFrame) => {
  const start = frameToSample(startFrame);
  const end = frameToSample(endFrame);
  let prev = 0;
  let band = 0;
  for (let i = start; i < end && i < n; i++) {
    const t = (i - start) / (end - start);
    const white = noiseAt(i * 2);
    const hp = white - prev;
    prev = white;
    const cutoff = 0.015 + t * t * 0.45;
    band += cutoff * (hp - band);
    const env = Math.pow(t, 1.7) * 0.2;
    L[i] += band * env;
    R[i] += band * env;
  }
};

[0, 60, 120].forEach((frame) => addKick(frame, 0.42));
for (let frame = cues.parallel; frame <= cues.best; frame += 30) {
  addKick(frame, frame === cues.best ? 1 : 0.76);
}
[750, 810, 870].forEach((frame) => addKick(frame, 0.5));

for (let frame = 210; frame <= cues.best; frame += 60) {
  addSnare(frame, frame === cues.best ? 0.42 : 0.24);
}

for (let frame = cues.parallel; frame < cues.best; frame += 15) {
  addHat(frame, frame % 30 === 15 ? 0.04 : 0.062);
}
for (let frame = cues.best; frame < cues.duration; frame += 30) {
  addHat(frame, 0.035);
}

const bassCycle = [73.42, 73.42, 87.31, 110.0];
let step = 0;
for (let frame = cues.parallel; frame < cues.best; frame += 30) {
  addBass(frame, bassCycle[step % bassCycle.length], 0.22, 0.26);
  step += 1;
}
[cues.best, 750, 810].forEach((frame) => addBass(frame, 73.42, 0.26, 0.48));

addPing(cues.one, 587.33, 0.11, 10);
addPing(cues.request, 698.46, 0.13, 9);
addPing(cues.sub, 880, 0.07, 11);
cues.lock.forEach((frame, index) => addPing(frame, 494 + index * 48, 0.08, 16));
addPing(cues.judge, 440, 0.15, 8);
addPing(cues.composite, 880, 0.18, 7);
addPing(cues.best, 293.66, 0.16, 4);
addPing(cues.best, 369.99, 0.12, 4.5);
addPing(cues.best, 440, 0.14, 5);
addPing(cues.best, 587.33, 0.1, 6);

addBurst(cues.parallel, 0.16, 0.1);
addBurst(cues.judge, 0.18, 0.11);
addBurst(cues.best, 0.38, 0.28);
addRiser(540, cues.best);

addPad(cues.chart, 146.83, 0.07, 3.5, 0.35);
addPad(cues.chart, 220.0, 0.055, 3.5, 0.55);
addPad(cues.chart, 349.23, 0.045, 3.5, 0.48);
addPad(cues.best, 146.83, 0.1, 3.5, 0.32);
addPad(cues.best, 184.997, 0.08, 3.5, 0.5);
addPad(cues.best, 220.0, 0.07, 3.5, 0.62);
addPad(cues.best, 293.66, 0.055, 3.5, 0.45);

for (let i = 0; i < n; i++) {
  const duck = 1 - Math.min(1, kickEnv[i]) * 0.78;
  L[i] += padL[i] * duck;
  R[i] += padR[i] * duck;
  L[i] = Math.tanh(L[i] * 1.15);
  R[i] = Math.tanh(R[i] * 1.15);
}

const fadeIn = Math.floor(sr * 0.02);
const fadeOut = Math.floor(sr * 0.55);
for (let i = 0; i < n; i++) {
  let g = 1;
  if (i < fadeIn) g *= i / fadeIn;
  if (i > n - fadeOut) g *= (n - i) / fadeOut;
  L[i] *= g;
  R[i] *= g;
}

let peak = 0.0001;
for (let i = 0; i < n; i++) {
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.9 / peak;
for (let i = 0; i < n; i++) {
  L[i] *= gain;
  R[i] *= gain;
}

const header = 44;
const buffer = Buffer.alloc(header + n * 4);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + n * 4, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sr, 24);
buffer.writeUInt32LE(sr * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) {
  buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767))), header + i * 4);
  buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * 32767))), header + i * 4 + 2);
}

const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "score.wav");
writeFileSync(outPath, buffer);
console.log(`wrote ${outPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, peak normalized from ${peak.toFixed(3)})`);
