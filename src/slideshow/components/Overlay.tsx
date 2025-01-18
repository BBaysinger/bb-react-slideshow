import React from "react";

import { SlideType } from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

const Overlay: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => (
  <div
    className={
      `${styles["overlay-wrapper-1"]} ` +
      `${classPrefix}overlay-wrapper ${classPrefix}overlay-wrapper-1`
    }
  >
    {slides.map((_, index) => (
      <div
        key={index}
        className={
          `${classPrefix}overlay-1-${index + 1} ` +
          `${styles.overlay} ${classPrefix}overlay ` +
          `${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} ` // +
          // `${index === previousIndexRef.current && isTransitioning ? ` ${classPrefix}previous` : ""}`
        }
      ></div>
    ))}
  </div>
);

export default Overlay;
