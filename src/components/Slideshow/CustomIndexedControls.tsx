import { useEffect, useRef } from "react";
import { SlideshowControl } from "./Slideshow.types";
import styles from "./CustomIndexedControls.module.scss";

const CustomIndexedControls: SlideshowControl = ({
  currentIndex,
  slides,
  onIndex,
  classPrefix = "",
}) => {
  const indexedButtonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Refs for indexed buttons (thumbnails or dots)

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
      className={`${styles["indexed-button-wrapper"]} ${classPrefix}indexed-button-wrapper`}
      role="tablist"
    >
      {slides.map((_, index) => (
        <button
          tabIndex={index}
          key={index}
          ref={(el) => {
            indexedButtonRefs.current[index] = el;
          }}
          onClick={() => onIndex(index)}
          className={
            `${styles["indexed-button"]} ` +
            `${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} ` +
            `${classPrefix}indexed-button`
          }
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
