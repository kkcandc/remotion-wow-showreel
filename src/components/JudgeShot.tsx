import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, cubicPoint, enter } from "../lib";
import { color, composite, cues, curve, lanes, plotBox, toPlot } from "../theme";
import { Vignette } from "./Chrome";
import { MaskedWord, ShotLabel } from "./Type";

export const JudgeShot: React.FC = () => {
  const frame = useCurrentFrame();
  const cover = at(frame, [60, 76], [1080, 0]);

  return (
    <AbsoluteFill style={{ background: color.red, overflow: "hidden" }}>
      <Poster frame={frame} />
      <AbsoluteFill style={{ transform: `translateY(${cover}px)`, background: color.ink }}>
        <Chart frame={frame} />
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Poster: React.FC<{ frame: number }> = ({ frame }) => {
  const rule = at(frame, [40, 58], [0, 520]);
  return (
    <AbsoluteFill>
      <ShotLabel index="03" title="THE JUDGE" fill={color.ink} aside="WEIGH THEM" />
      <div style={{ position: "absolute", left: 88, top: 300 }}>
        <MaskedWord text="NOTHING" delay={8} size={168} color={color.ink} />
        <div style={{ height: 10 }} />
        <MaskedWord text="WINS ALONE" delay={26} size={168} color={color.ink} />
        <div
          style={{
            marginTop: 28,
            height: 14,
            width: rule,
            background: color.yellow,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 92,
          bottom: 92,
          fontFamily: font.mono,
          letterSpacing: "0.18em",
          fontSize: 18,
          color: color.ink,
          opacity: at(frame, [36, 52], [0, 1]),
        }}
      >
        FOUR ANSWERS. NO SINGLE WINNER.
      </div>
    </AbsoluteFill>
  );
};

const Chart: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - 60;
  const draw = at(local, [28, 110], [0, 1]);
  const showComposite = enter(frame, fps, 210);
  const start = toPlot(curve.start.coverage, curve.start.fidelity);
  const c1 = toPlot(curve.c1.coverage, curve.c1.fidelity);
  const c2 = toPlot(curve.c2.coverage, curve.c2.fidelity);
  const end = toPlot(curve.end.coverage, curve.end.fidelity);
  const d = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  const head = {
    x: cubicPoint(draw, start.x, c1.x, c2.x, end.x),
    y: cubicPoint(draw, start.y, c1.y, c2.y, end.y),
  };
  const spin = frame * 0.9;

  return (
    <AbsoluteFill>
      <ShotLabel index="03" title="THE JUDGE" fill={color.cream} aside="EFFICIENT FRONTIER" />
      <Wireframe spin={spin} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect
          x={plotBox.x}
          y={plotBox.y}
          width={plotBox.w}
          height={plotBox.h}
          fill="rgba(243,238,230,0.035)"
          stroke={color.creamSoft}
          strokeWidth={1.5}
        />
        {[0.25, 0.5, 0.75].map((g) => (
          <g key={g}>
            <line
              x1={plotBox.x + g * plotBox.w}
              x2={plotBox.x + g * plotBox.w}
              y1={plotBox.y}
              y2={plotBox.y + plotBox.h}
              stroke={color.creamFaint}
            />
            <line
              y1={plotBox.y + g * plotBox.h}
              y2={plotBox.y + g * plotBox.h}
              x1={plotBox.x}
              x2={plotBox.x + plotBox.w}
              stroke={color.creamFaint}
            />
          </g>
        ))}
        <path
          d={d}
          fill="none"
          stroke={color.yellow}
          strokeWidth={22}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          opacity={0.2}
        />
        <path
          d={d}
          fill="none"
          stroke={color.yellow}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {draw > 0.02 && draw < 0.995 ? (
          <circle cx={head.x} cy={head.y} r={7} fill={color.yellow} />
        ) : null}
        <text
          x={plotBox.x + plotBox.w / 2}
          y={plotBox.y + plotBox.h + 48}
          textAnchor="middle"
          fill={color.creamSoft}
          fontFamily={font.mono}
          fontSize={16}
          letterSpacing={4}
        >
          COVERAGE
        </text>
        <text
          x={plotBox.x - 48}
          y={plotBox.y + plotBox.h / 2}
          textAnchor="middle"
          fill={color.creamSoft}
          fontFamily={font.mono}
          fontSize={16}
          letterSpacing={4}
          transform={`rotate(-90 ${plotBox.x - 48} ${plotBox.y + plotBox.h / 2})`}
        >
          FIDELITY
        </text>
      </svg>
      {lanes.map((lane, i) => {
        const p = toPlot(lane.coverage, lane.fidelity);
        const spr = enter(frame, fps, 90 + i * 8);
        const dim = 1 - showComposite * 0.4;
        return (
          <div
            key={lane.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) scale(${spr})`,
              opacity: spr * dim,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 99,
                background: color.cream,
                margin: "0 auto",
              }}
            />
            <div
              style={{
                marginTop: 8,
                fontFamily: font.mono,
                fontSize: 13,
                letterSpacing: "0.14em",
                color: color.cream,
              }}
            >
              {lane.id}
            </div>
          </div>
        );
      })}
      <CompositeMark appear={showComposite} />
      <ScoreRail frame={frame} appear={showComposite} />
    </AbsoluteFill>
  );
};

const CompositeMark: React.FC<{ appear: number }> = ({ appear }) => {
  const p = toPlot(composite.coverage, composite.fidelity);
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, opacity: appear }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 26,
          height: 26,
          background: color.yellow,
          transform: `translate(-50%, -50%) scale(${0.4 + appear * 0.6}) rotate(45deg)`,
          boxShadow: `0 0 0 ${10 * appear}px rgba(228,255,58,0.18)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 22,
          top: -28,
          fontFamily: font.mono,
          fontSize: 14,
          letterSpacing: "0.16em",
          color: color.yellow,
          whiteSpace: "nowrap",
        }}
      >
        COMPOSITE
      </div>
    </div>
  );
};

const ScoreRail: React.FC<{ frame: number; appear: number }> = ({ frame, appear }) => {
  const rows = [
    ...lanes.map((lane) => ({ name: lane.name, score: lane.score, hero: false })),
    { name: composite.name, score: composite.score, hero: true },
  ];
  return (
    <div style={{ position: "absolute", left: 1260, top: 280, width: 560 }}>
      <div
        style={{
          fontFamily: font.mono,
          letterSpacing: "0.2em",
          fontSize: 14,
          color: color.creamSoft,
          marginBottom: 18,
        }}
      >
        JUDGE SCORE
      </div>
      {rows.map((row, i) => {
        const p = row.hero ? appear : at(frame, [100 + i * 10, 148 + i * 10], [0, 1]);
        const shown = row.score * p;
        const dim = row.hero ? 1 : 1 - appear * 0.45;
        return (
          <div key={row.name} style={{ marginBottom: 18, opacity: Math.max(p, 0.001) * dim }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: font.mono,
                fontSize: 18,
                letterSpacing: "0.12em",
                color: row.hero ? color.yellow : color.cream,
              }}
            >
              <span>{row.name}</span>
              <span>{shown.toFixed(2)}</span>
            </div>
            <div style={{ marginTop: 6, height: 3, background: color.creamFaint }}>
              <div
                style={{
                  width: `${shown * 100}%`,
                  height: "100%",
                  background: row.hero ? color.yellow : color.cream,
                }}
              />
            </div>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 12,
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "-0.03em",
          color: color.yellow,
          opacity: appear,
        }}
      >
        DOMINATES THE FIELD
      </div>
    </div>
  );
};

const VERTS: Array<[number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const EDGES: Array<[number, number]> = [];
for (let i = 0; i < VERTS.length; i++) {
  for (let j = i + 1; j < VERTS.length; j++) {
    const a = VERTS[i];
    const b = VERTS[j];
    const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    if (dot === 0) {
      EDGES.push([i, j]);
    }
  }
}

const project = (v: [number, number, number], rot: number) => {
  const cy = Math.cos(rot);
  const sy = Math.sin(rot);
  const x1 = v[0] * cy - v[2] * sy;
  const z1 = v[0] * sy + v[2] * cy;
  const tilt = 0.7;
  const cx = Math.cos(tilt);
  const sx = Math.sin(tilt);
  const y2 = v[1] * cx - z1 * sx;
  const z2 = v[1] * sx + z1 * cx;
  const f = 2.4 / (2.4 + z2);
  return { x: x1 * f, y: y2 * f, z: z2 };
};

const Wireframe: React.FC<{ spin: number }> = ({ spin }) => {
  const rot = (spin * Math.PI) / 180;
  const pts = VERTS.map((v) => project(v, rot));
  const size = 70;
  const cx = 1688;
  const cy = 930;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.85 }}>
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={cx + pts[a].x * size}
          y1={cy + pts[a].y * size}
          x2={cx + pts[b].x * size}
          y2={cy + pts[b].y * size}
          stroke={color.cream}
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
};
