import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BestShot } from "./components/BestShot";
import { Chrome, Grain, Wipe } from "./components/Chrome";
import { JudgeShot } from "./components/JudgeShot";
import { ParallelShot } from "./components/ParallelShot";
import { RequestShot } from "./components/RequestShot";
import "./fonts";
import { color, cues, DURATION } from "./theme";

export const Showreel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: color.ink, overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={cues.parallel + 12}>
        <RequestShot />
      </Sequence>
      <Sequence from={cues.parallel} durationInFrames={cues.judge - cues.parallel + 12}>
        <ParallelShot />
      </Sequence>
      <Sequence from={cues.judge} durationInFrames={cues.best - cues.judge + 12}>
        <JudgeShot />
      </Sequence>
      <Sequence from={cues.best} durationInFrames={DURATION - cues.best}>
        <BestShot />
      </Sequence>
      <Wipe atFrame={cues.parallel} color={color.ink} />
      <Wipe atFrame={cues.judge} color={color.red} />
      <Wipe atFrame={cues.best} color={color.yellow} />
      <Chrome />
      <Grain />
      {frame >= 0 ? <Audio src={staticFile("score.wav")} volume={0.92} /> : null}
    </AbsoluteFill>
  );
};
