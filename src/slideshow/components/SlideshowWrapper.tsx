import React from "react";

import styles from "./Slideshow.module.scss";

const SlideshowWrapper: React.FC<{
  children: React.ReactNode;
  classPrefix: string;
  isPaused: boolean;
  isTransitioning: boolean;
  currentSlug: string;
}> = ({ children, classPrefix, isPaused, isTransitioning, currentSlug }) => (
  <div
    className={
      `${styles["slideshow-wrapper"]} ${classPrefix}slideshow ` +
      `${classPrefix}slideshow-slide-${currentSlug} ` +
      `${isTransitioning ? `${styles.transitioning} ${classPrefix}transitioning` : ""}` +
      `${isPaused ? `${styles.paused} ${classPrefix}paused` : ""}`
    }
  >
    {children}
  </div>
);

export default SlideshowWrapper;
