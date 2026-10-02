import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, easeOut, timecode } from "../lib";
import { color, cues, DURATION } from "../theme";

const plateOf = (frame: number) => {
  if (frame < cues.parallel) return "light" as const;
  if (frame < cues.judge) return "dark" as const;
  if (frame < cues.chart) return "red" as const;
  if (frame < cues.best) return "dark" as const;
  return "yellow" as const;
};

export const Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const plate = plateOf(frame);
  const inkOnLight = plate === "light" || plate === "red" || plate === "yellow";
  const fg = inkOnLight ? color.ink : color.cream;
  const dim = inkOnLight ? color.inkSoft : color.creamSoft;
  const opacity = at(frame, [0, 16, cues.best - 8, cues.best + 6], [0, 1, 1, 0]);
  const index =
    frame < cues.parallel ? "01" : frame < cues.judge ? "02" : frame < cues.best ? "03" : "04";
  const progress = frame / (DURATION - 1);

  if (opacity <= 0.01) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, zIndex: 40 }}>
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: font.mono,
          fontSize: 16,
          letterSpacing: "0.18em",
          color: fg,
        }}
      >
        <span>{timecode(frame, fps)}</span>
        <span style={{ color: dim }}>
          {index} / 04
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 36,
          height: 2,
          background: inkOnLight ? color.inkFaint : color.creamFaint,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: plate === "dark" ? color.yellow : color.ink,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 19) % 160;
  const y = (frame * 11) % 160;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.16, mixBlendMode: "overlay", zIndex: 46 }}>
      <svg width="100%" height="100%" style={{ transform: `translate(${x - 40}px, ${y - 40}px) scale(1.25)` }}>
        <filter id="frontier-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
        </filter>
        <rect width="150%" height="150%" filter="url(#frontier-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Wipe: React.FC<{ atFrame: number; color: string }> = ({ atFrame, color }) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;
  if (local < 0 || local > 10) {
    return null;
  }
  const p = at(local, [0, 9], [0, 1], easeOut);
  return (
    <AbsoluteFill
      style={{
        background: color,
        transform: `scaleX(${Math.max(p, 0.001)})`,
        transformOrigin: "left center",
        zIndex: 32,
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);
