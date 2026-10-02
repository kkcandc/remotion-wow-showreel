import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, enter } from "../lib";
import { color, cues, lanes } from "../theme";
import { MaskedWord } from "./Type";

export const BestShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const global = frame + cues.best;
  const title = enter(frame, fps, cues.bestTitle - cues.best);
  const shift = at(frame, [cues.bestTitle - cues.best, cues.bestTitle - cues.best + 10], [16, 0]);
  const sub = at(global, [cues.bestSub, cues.bestSub + 16], [0, 1]);
  const pipe = at(global, [cues.bestPipe, cues.bestPipe + 18], [0, 1]);
  const breathe = 1 + Math.sin(frame / 28) * 0.008;

  return (
    <AbsoluteFill style={{ background: color.yellow, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${breathe})` }}>
        <div
          style={{
            position: "absolute",
            top: 78,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: font.mono,
            letterSpacing: "0.22em",
            fontSize: 16,
            color: color.ink,
            opacity: at(frame, [8, 20], [0, 0.7]),
          }}
        >
          <span>04  /  THE COMPOSITE</span>
          <span>ABSTRACT STUDY</span>
        </div>
        <div style={{ position: "absolute", left: 80, top: 230 }}>
          <div
            style={{
              transform: `scale(${0.86 + title * 0.14})`,
              transformOrigin: "left center",
              textShadow: `${shift}px 0 ${color.red}, ${-shift}px 0 ${color.ink}`,
            }}
          >
            <MaskedWord text="BEST" delay={cues.bestTitle - cues.best} size={280} color={color.ink} track="-0.06em" />
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: "-0.03em",
              color: color.ink,
              opacity: sub,
              transform: `translateY(${(1 - sub) * 16}px)`,
            }}
          >
            Many answers. One composite.
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 18,
              alignItems: "center",
              fontFamily: font.mono,
              letterSpacing: "0.16em",
              fontSize: 18,
              color: color.ink,
              opacity: pipe,
            }}
          >
            {["REQUEST", "PARALLEL", "JUDGE", "BEST"].map((step, i) => (
              <React.Fragment key={step}>
                {i > 0 ? <span style={{ opacity: 0.45 }}>→</span> : null}
                <span>{step}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 28, opacity: pipe }}>
            {lanes.map((lane) => (
              <span
                key={lane.id}
                style={{
                  width: 18,
                  height: 18,
                  background: color.ink,
                  transform: lane.id === "04" ? "rotate(45deg) scale(0.8)" : undefined,
                }}
              />
            ))}
            <span
              style={{
                width: 18,
                height: 18,
                background: color.ink,
                transform: "rotate(45deg)",
                marginLeft: 8,
                boxShadow: `6px 6px 0 ${color.red}`,
              }}
            />
          </div>
        </div>
        <Pinwheel frame={frame} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Pinwheel: React.FC<{ frame: number }> = ({ frame }) => {
  const rot = frame * 1.6;
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        bottom: 110,
        width: 88,
        height: 88,
        transform: `rotate(${rot}deg)`,
      }}
    >
      {[0, 90, 180, 270].map((angle) => (
        <div
          key={angle}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 8,
            height: 28,
            marginLeft: -4,
            marginTop: -40,
            background: color.ink,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "4px 40px",
          }}
        />
      ))}
    </div>
  );
};
