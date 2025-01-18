import React from "react";

const SlideshowWrapper: React.FC<{
  children: React.ReactNode;
  classPrefix: string;
  isPaused: boolean;
  isTransitioning: boolean;
}> = ({ children, classPrefix, isPaused, isTransitioning }) => (
  <div
    className={`${classPrefix}slideshow ${isTransitioning ? `${classPrefix}transitioning` : ""} ${isPaused ? `${classPrefix}paused` : ""}`}
    aria-roledescription="carousel"
    aria-live="polite"
    aria-busy={isTransitioning}
  >
    {children}
  </div>
);

export default SlideshowWrapper;
