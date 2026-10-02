import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, enter, mulberry32, scramble } from "../lib";
import { color, cues, lanes } from "../theme";
import { Vignette } from "./Chrome";
import { ShotLabel } from "./Type";

const COL_W = 360;
const GAP = 32;

export const ParallelShot: React.FC = () => {
  const frame = useCurrentFrame();
  const global = frame + cues.parallel;
  const yaw = at(frame, [0, 240], [-5.5, 4.2]);
  const pitch = at(frame, [0, 240], [6.5, 2]);
  const push = at(frame, [0, 240], [1.04, 1]);

  return (
    <AbsoluteFill style={{ background: color.ink, overflow: "hidden" }}>
      <Grid frame={frame} />
      <Particles frame={global} />
      <AbsoluteFill
        style={{
          perspective: 1400,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `rotateX(${pitch}deg) rotateY(${yaw}deg) scale(${push})`,
            transformOrigin: "50% 58%",
          }}
        >
          <GhostMark />
          <ShotLabel index="02" title="IN PARALLEL" fill={color.cream} aside="SAME BRIEF" />
          {lanes.map((lane, i) => (
            <Trace key={lane.id} index={i} frame={frame} global={global} />
          ))}
          <Scan frame={frame} />
        </AbsoluteFill>
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

const Trace: React.FC<{ index: number; frame: number; global: number }> = ({
  index,
  frame,
  global,
}) => {
  const { fps } = useVideoConfig();
  const lane = lanes[index];
  const total = lanes.length * COL_W + (lanes.length - 1) * GAP;
  const origin = (1920 - total) / 2;
  const x = origin + index * (COL_W + GAP);
  const lockAt = cues.lock[index] - cues.parallel;
  const spr = enter(frame, fps, 12 + index * 6);
  const y = (1 - spr) * 90 + [0, 16, 6, 22][index];
  const locked = global >= cues.lock[index];
  const lineA = scramble(lane.lines[0], frame, 20 + index * 8);
  const lineB = scramble(lane.lines[1], frame, 28 + index * 8);
  const rule = at(frame, [lockAt - 18, lockAt], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 230 + y,
        width: COL_W,
        opacity: spr,
      }}
    >
      <div
        style={{
          fontFamily: font.mono,
          color: color.creamSoft,
          letterSpacing: "0.2em",
          fontSize: 15,
        }}
      >
        TRACE {lane.id}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: "0.08em",
          color: color.cream,
        }}
      >
        {lane.name}
      </div>
      <div
        style={{
          marginTop: 16,
          height: 3,
          width: "100%",
          background: color.creamFaint,
        }}
      >
        <div
          style={{
            width: `${rule * 100}%`,
            height: "100%",
            background: locked ? color.yellow : color.cream,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
          color: color.cream,
          minHeight: 78,
        }}
      >
        <div>{lineA}</div>
        <div>{lineB}</div>
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: font.mono,
          letterSpacing: "0.18em",
          fontSize: 14,
          color: locked ? color.ink : color.creamSoft,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            background: locked ? color.yellow : "transparent",
            border: `1.5px solid ${locked ? color.yellow : color.creamSoft}`,
          }}
        />
        <span
          style={{
            background: locked ? color.yellow : "transparent",
            color: locked ? color.ink : color.creamSoft,
            padding: locked ? "4px 8px" : 0,
          }}
        >
          {locked ? "LOCKED" : "RUNNING"}
        </span>
      </div>
    </div>
  );
};

const Scan: React.FC<{ frame: number }> = ({ frame }) => {
  const cycle = (frame % 80) / 80;
  if (frame < 40) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: `${8 + cycle * 84}%`,
        top: 210,
        bottom: 120,
        width: 2,
        background: color.yellow,
        opacity: 0.85,
        boxShadow: `0 0 18px ${color.yellow}`,
      }}
    />
  );
};

const GhostMark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 70,
      top: 300,
      fontFamily: font.display,
      fontWeight: 800,
      fontSize: 460,
      lineHeight: 0.8,
      letterSpacing: "-0.07em",
      color: "transparent",
      WebkitTextStroke: `1px ${color.creamFaint}`,
      opacity: 0.7,
    }}
  >
    ×4
  </div>
);

const Grid: React.FC<{ frame: number }> = ({ frame }) => {
  const shift = (frame * 1.4) % 90;
  return (
    <div
      style={{
        position: "absolute",
        left: "-15%",
        width: "130%",
        height: "78%",
        bottom: "-12%",
        backgroundImage: `
          linear-gradient(to right, ${color.creamFaint} 1px, transparent 1px),
          linear-gradient(to bottom, ${color.creamFaint} 1px, transparent 1px)
        `,
        backgroundSize: "90px 90px",
        backgroundPosition: `0 ${shift}px`,
        transform: "perspective(700px) rotateX(68deg)",
        transformOrigin: "center top",
        WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 75%)",
        maskImage: "linear-gradient(to top, black 10%, transparent 75%)",
        opacity: at(frame, [0, 24], [0, 1]),
      }}
    />
  );
};

const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const specks = React.useMemo(() => {
    const rand = mulberry32(11);
    return new Array(56).fill(0).map(() => ({
      x: rand(),
      y: rand(),
      s: 2 + rand() * 5,
      v: 0.15 + rand() * 0.7,
      sq: rand() > 0.45,
    }));
  }, []);

  return (
    <AbsoluteFill>
      {specks.map((p, i) => {
        const y = (p.y - ((frame * p.v) % 140) / 140 + 1) % 1;
        const x = p.x + Math.sin(frame / 48 + i) * 0.008;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: p.s,
              height: p.s,
              background: i % 7 === 0 ? color.yellow : color.cream,
              opacity: i % 7 === 0 ? 0.95 : 0.62,
              transform: p.sq ? `rotate(${frame + i}deg)` : undefined,
              borderRadius: p.sq ? 0 : 99,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
