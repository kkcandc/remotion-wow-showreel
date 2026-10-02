import { loadFont as loadDisplay } from "@remotion/google-fonts/Syne";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const display = loadDisplay("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const font = {
  display: display.fontFamily,
  mono: mono.fontFamily,
};
