import React from "react";
import clsx from "clsx";

import { SlideType } from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

const ForegroundWrapper: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => (
  <div
    className={clsx(
      styles["foreground-wrapper"],
      `${classPrefix}foreground-wrapper`,
    )}
  >
    {slides.map((_, index) => (
      <div
        key={index}
        className={clsx(
          `${classPrefix}foreground-slide-${index + 1}`,
          styles["foreground-slide"],
          `${classPrefix}foreground-slide`,
          index === currentIndex && styles.active,
          index === currentIndex && `${classPrefix}active`,
        )}
      ></div>
    ))}
  </div>
);

export default ForegroundWrapper;
