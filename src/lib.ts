import { Easing, interpolate, spring } from "remotion";

export const at = (
  frame: number,
  input: readonly number[],
  output: readonly number[],
  easing?: (t: number) => number,
) =>
  interpolate(frame, [...input], [...output], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const enter = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 168, mass: 0.48 },
  });

export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const scramble = (target: string, frame: number, start: number) => {
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (ch === " ") {
      out += " ";
      continue;
    }
    const age = frame - start - i * 2;
    if (age <= 0) {
      out += "·";
    } else if (age < 8) {
      const roll = mulberry32((i + 1) * 97 + start * 13 + Math.floor(age) * 17)();
      out += GLYPHS[Math.floor(roll * GLYPHS.length)];
    } else {
      out += ch;
    }
  }
  return out;
};

export const timecode = (frame: number, fps: number) => {
  const frames = frame % fps;
  const seconds = Math.floor(frame / fps);
  const ss = seconds % 60;
  const mm = Math.floor(seconds / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(mm)}:${pad(ss)}:${pad(frames)}`;
};

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

export const cubicPoint = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};
