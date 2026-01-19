import { useEffect, useRef } from "react";
import clsx from "clsx";

import { SlideshowControlType } from "../Slideshow.types";
import styles from "./CustomIndexedControls.module.scss";

const CustomIndexedControls: SlideshowControlType = ({
  currentIndex = 0,
  slides,
  onIndex,
  classPrefix,
}) => {
  // Refs for indexed buttons (thumbnails or dots)
  const indexedButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    // Ensure the current indexed element exists before attempting to focus it
    if (indexedButtonRefs.current && indexedButtonRefs.current[currentIndex]) {
      // Set focus to the thumbnail corresponding to the current slide
      // 'preventScroll: true' ensures that focusing the element doesn't cause scrolling
      indexedButtonRefs.current[currentIndex]!.focus({
        preventScroll: true,
      });
    }
  });

  return (
    <div
      className={clsx(
        styles["indexed-button-wrapper"],
        `${classPrefix}indexed-button-wrapper`,
      )}
      role="tablist"
    >
      {slides?.map((_, index) => (
        <button
          tabIndex={index}
          key={index}
          ref={(el) => {
            indexedButtonRefs.current[index] = el;
          }}
          onClick={() => onIndex?.(index)}
          className={clsx(
            styles["indexed-button"],
            `${classPrefix}indexed-button`,
            index === currentIndex && styles.active,
            index === currentIndex && `${classPrefix}active`,
          )}
          role="tab"
          aria-selected={index === currentIndex}
          aria-controls={`slide-${index}`}
          id={`tab-${index}`}
        >
          {slides[index].thumbnail && (
            <img
              src={slides[index].thumbnail}
              alt={slides[index].alt || `Slide button ${index + 1}`}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default CustomIndexedControls;
