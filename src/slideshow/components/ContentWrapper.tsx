import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { SlideType } from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

const ContentWrapper: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Height of the element, adjusted for content
  const [divHeight, setDivHeight] = useState<string>("unset");

  useEffect(() => {
    // Updates the height of the container to match the current slide's height.
    // to reduce whitespace and avoid overflow issues.
    let resizeId: number | null = null;

    const updateHeight = () => {
      const currentSlide = slideRefs.current[currentIndex];
      if (currentSlide) {
        const height = currentSlide.offsetHeight;
        setDivHeight(height ? `${height}px` : "unset");
      }
    };

    const throttledUpdateHeight = () => {
      if (!resizeId) {
        resizeId = requestAnimationFrame(() => {
          updateHeight();
          resizeId = null;
        });
      }
    };

    // Initial update
    updateHeight();

    // Attach throttled event listener
    window.addEventListener("resize", throttledUpdateHeight);

    return () => {
      // Cleanup event listener and cancel any pending animation frame
      window.removeEventListener("resize", throttledUpdateHeight);
      if (resizeId !== null) {
        cancelAnimationFrame(resizeId);
      }
    };
  }, [currentIndex]);

  return (
    <div
      className={clsx(styles["content-wrapper"], `${classPrefix}content-wrapper`)}
      style={{ height: divHeight }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={(el) => {
            slideRefs.current[index] = el;
          }}
          className={clsx(
            `${classPrefix}content`,
            index === currentIndex && `${classPrefix}active`,
          )}
        >
          {slide.content}
        </div>
      ))}
    </div>
  );
};

export default ContentWrapper;
