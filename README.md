# FRONTIER

A 15-second abstract motion study of multi-model judgment.

One request goes out in parallel. Four traces answer. A judge plots them and draws the efficient frontier. The composite — not any single trace — dominates the field.

This is an original Remotion film. It is not an official Unbiased, Pareto, or The Unbiased Co. product, and it does not use their names, marks, or branding.

The picture is designed to read on mute. An original score is included and hits the same cuts.

## What plays

| Time | Act | Picture |
| --- | --- | --- |
| 0.0–3.0 | Request | Cream field. The brief locks in. One mark splits into four. |
| 3.0–7.0 | Parallel | Four traces decode the same ask on a moving grid. |
| 7.0–11.5 | Judge | A hard cut to the weighing, then the frontier. The composite lands above the field. |
| 11.5–15.0 | Best | Yellow end card. The pipeline holds: request, parallel, judge, best. |

1920×1080, 60 fps, 900 frames.

## Requirements

- Node.js 18 or newer
- FFmpeg on your PATH (used by Remotion to encode the MP4)

## Studio

```bash
npm i
npx remotion studio
```

`npm run studio` does the same thing. Open the `Showreel` composition.

## Render an MP4

High-quality file, written to `out/showreel.mp4`:

```bash
npm run render
```

That runs `scripts/render-mp4.mjs` (H.264, CRF 16, 1080p60, with the score).

Web preview file plus a poster still:

```bash
npm run render:preview
```

Outputs:

- `preview/showreel.mp4`
- `preview/poster.png` (frame 820)

Then open `preview/index.html` in a browser. Playback starts muted. Chapter buttons jump to each act.

Regenerate the score, if you want a fresh wav from the same cues:

```bash
npm run score
```

`public/score.wav` is the file the composition plays. Cue points live in `src/cues.json`, shared by the picture and the score.

## Project map

- `src/Showreel.tsx` — timeline, wipes, audio
- `src/components/*Shot.tsx` — the four acts
- `src/cues.json` — frame-accurate cuts
- `scripts/render-mp4.mjs` — MP4 export
- `scripts/make-score.mjs` — original 15-second score, no external audio APIs
- `preview/index.html` — static player

No paid generation APIs. Type, motion, and sound are all in the repo.
