import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, enter } from "../lib";
import { color, cues } from "../theme";
import { Brackets, MaskedWord, ShotLabel } from "./Type";

export const RequestShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const push = at(frame, [0, 170], [1.035, 1]);
  const marker = enter(frame, fps, 70);
  const subY = at(frame, [cues.sub, cues.sub + 18], [22, 0]);
  const subO = at(frame, [cues.sub, cues.sub + 14], [0, 1]);
  const split = at(frame, [cues.split, cues.split + 28], [0, 1]);

  return (
    <AbsoluteFill style={{ background: color.cream, transform: `scale(${push})` }}>
      <Brackets fill={color.ink} />
      <ShotLabel index="01" title="THE BRIEF" fill={color.ink} aside="ONE QUESTION" />
      <div style={{ position: "absolute", left: 88, top: 250 }}>
        <MaskedWord text="ONE" delay={cues.one} size={196} color={color.ink} />
        <div style={{ position: "relative", marginTop: 6, display: "inline-block" }}>
          <div
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "34%",
              height: "38%",
              background: color.yellow,
              transform: `scaleX(${marker})`,
              transformOrigin: "left center",
            }}
          />
          <div style={{ position: "relative" }}>
            <MaskedWord text="REQUEST" delay={cues.request} size={196} color={color.ink} />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 760,
          fontFamily: font.mono,
          fontSize: 22,
          letterSpacing: "0.2em",
          color: color.ink,
          opacity: subO,
          transform: `translateY(${subY}px)`,
        }}
      >
        SENT TO EVERY MIND AT ONCE
      </div>
      <SplitDots progress={split} />
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 280,
          bottom: 160,
          writingMode: "vertical-rl",
          fontFamily: font.mono,
          fontSize: 14,
          letterSpacing: "0.28em",
          color: color.ink,
          opacity: 0.55,
        }}
      >
        MULTI-MODEL STUDY
      </div>
    </AbsoluteFill>
  );
};

const SplitDots: React.FC<{ progress: number }> = ({ progress }) => {
  const targets = [0.2, 0.4, 0.6, 0.8];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 24 }}>
      {targets.map((x, i) => {
        const px = 50 + (x * 100 - 50) * progress;
        const scale = progress === 0 ? 0 : 0.4 + progress * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${px}%`,
              top: 0,
              width: 14,
              height: 14,
              marginLeft: -7,
              borderRadius: 99,
              background: i === 3 ? color.yellow : color.ink,
              transform: `scale(${i === 0 && progress < 0.08 ? enterScale(progress) : scale})`,
              boxShadow: i === 3 ? "0 0 0 6px rgba(228,255,58,0.25)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

const enterScale = (progress: number) => (progress <= 0 ? 0 : 1);
