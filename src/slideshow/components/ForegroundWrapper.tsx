import React from "react";

import { SlideType } from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

const ForegroundWrapper: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => (
  <div
    className={`${styles["foreground-wrapper"]} ${classPrefix}foreground-wrapper`}
  >
    {slides.map((_, index) => (
      <div
        key={index}
        className={
          `${classPrefix}foreground-slide-${index + 1} ` +
          `${styles["foreground-slide"]} ${classPrefix}foreground-slide ` +
          `${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} `
        }
      ></div>
    ))}
  </div>
);

export default ForegroundWrapper;
