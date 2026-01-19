import React from "react";
import clsx from "clsx";

import styles from "./Slideshow.module.scss";

const SlideshowWrapper: React.FC<{
  children: React.ReactNode;
  classPrefix: string;
  isPaused: boolean;
  isTransitioning: boolean;
  currentSlug: string;
}> = ({ children, classPrefix, isPaused, isTransitioning, currentSlug }) => (
  <div
    className={clsx(
      styles["slideshow-wrapper"],
      `${classPrefix}slideshow`,
      `${classPrefix}slideshow-slide-${currentSlug}`,
      isTransitioning && styles.transitioning,
      isTransitioning && `${classPrefix}transitioning`,
      isPaused && styles.paused,
      isPaused && `${classPrefix}paused`,
    )}
  >
    {children}
  </div>
);

export default SlideshowWrapper;
