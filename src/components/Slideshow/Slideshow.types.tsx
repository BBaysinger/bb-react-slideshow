import React from "react";

interface Slide {
  slug: string;
  background: string;
  thumbnail: string;
  foreground?: string;
  alt?: string;
  desc?: string;
  content?: React.ReactNode;
}

interface SlideshowProps {
  slides: Slide[];
  basePath?: string;
  initialAutoSlide?: boolean;
  interval?: number;
  content?: React.ReactNode;
  heading?: React.ReactNode;
  enableRouting?: boolean;
  restartDelay?: number;
  previousLabel?: string;
  nextLabel?: string;
  resumeLabel?: string;
  pauseLabel?: string;
  resetDelay?: number;
  manipulateContent?: (
    content: React.ReactNode,
    isActive: boolean,
  ) => React.ReactNode;
}

export type { SlideshowProps, Slide };