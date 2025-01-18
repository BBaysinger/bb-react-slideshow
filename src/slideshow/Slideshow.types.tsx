import React from "react";

interface SlideType {
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
  slides: SlideType[];
  basePath?: string;
  autoSlideMode?: AutoSlideMode;
  interval?: number;
  enableRouting?: boolean;
  restartDelay?: number;
  transitionResetDelay?: number;
  classPrefix: string;
  controls?: SlideshowControlType[];
  debug?: string | number | boolean | null;
}

export type SlideshowControlType = React.FC<{
  currentIndex: number | undefined;
  slides?: SlideType[];
  onPrev: () => void;
  onNext: () => void;
  onIndex?: (index: number) => void;
  onTogglePause: () => void;
  isPaused: boolean;
  labels?: SlideshowLabels;
  classPrefix: string;
}>;

export type { SlideshowProps, SlideType, SlideshowLabels, AutoSlideMode };
