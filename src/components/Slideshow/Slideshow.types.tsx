import React from "react";

interface Slide {
  slug: string;
  background: string;
  thumbnail?: string;
  foreground?: string;
  alt?: string;
  desc?: string;
  content?: React.ReactNode;
  title?: string;
}

export const AUTOSLIDE_MODES = {
  NONE: "none",
  INITIAL: "initial",
  PERSISTENT: "persistent",
} as const;

type AutoSlideMode = (typeof AUTOSLIDE_MODES)[keyof typeof AUTOSLIDE_MODES];

type SlideshowLabels = {
  previous?: string;
  next?: string;
  resume?: string;
  pause?: string;
};

interface SlideshowProps {
  slides: Slide[];
  basePath?: string;
  autoSlideMode?: AutoSlideMode;
  interval?: number;
  content?: React.ReactNode;
  heading?: React.ReactNode;
  enableRouting?: boolean;
  restartDelay?: number;
  labels?: SlideshowLabels;
  transitionResetDelay?: number;
  classPrefix?: string;
  debug?: string | number | boolean | null;
}

export type { SlideshowProps, Slide, SlideshowLabels, AutoSlideMode };
