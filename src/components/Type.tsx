import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { font } from "../fonts";
import { at, enter } from "../lib";

export const MaskedWord: React.FC<{
  text: string;
  delay?: number;
  size: number;
  color: string;
  weight?: number;
  track?: string;
}> = ({ text, delay = 0, size, color: fill, weight = 800, track = "-0.045em" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        fontFamily: font.display,
        fontWeight: weight,
        fontSize: size,
        letterSpacing: track,
        color: fill,
        lineHeight: 0.92,
      }}
    >
      {text.split("").map((ch, i) => {
        const spr = enter(frame, fps, delay + i * 1.35);
        return (
          <span
            key={`${ch}-${i}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "1.05em",
              lineHeight: 0.92,
            }}
          >
            <span
              style={{
                display: "block",
                transform: `translateY(${(1 - spr) * 110}%)`,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const ShotLabel: React.FC<{
  index: string;
  title: string;
  fill: string;
  aside?: string;
}> = ({ index, title, fill, aside }) => {
  const frame = useCurrentFrame();
  const y = at(frame, [6, 22], [18, 0], ease);
  const opacity = at(frame, [6, 20], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        top: 88,
        left: 72,
        right: 72,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: font.mono,
        fontSize: 18,
        letterSpacing: "0.22em",
        color: fill,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span>
        {index}
        <span style={{ opacity: 0.45 }}>  /  </span>
        {title}
      </span>
      {aside ? <span style={{ opacity: 0.7 }}>{aside}</span> : null}
    </div>
  );
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export const Brackets: React.FC<{ fill: string; inset?: number }> = ({ fill, inset = 28 }) => {
  const frame = useCurrentFrame();
  const grow = at(frame, [0, 18], [8, 34]);
  const corner = (style: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: grow,
    height: grow,
    borderColor: fill,
    borderStyle: "solid",
    opacity: 0.85,
    ...style,
  });
  return (
    <>
      <div style={corner({ top: inset, left: inset, borderWidth: "2px 0 0 2px" })} />
      <div style={corner({ top: inset, right: inset, borderWidth: "2px 2px 0 0" })} />
      <div style={corner({ bottom: inset, left: inset, borderWidth: "0 0 2px 2px" })} />
      <div style={corner({ bottom: inset, right: inset, borderWidth: "0 2px 2px 0" })} />
    </>
  );
};
