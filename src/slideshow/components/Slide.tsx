import React from "react";
import clsx from "clsx";

import { SlideType } from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

const Slide: React.FC<{
  slide: SlideType;
  isActive: boolean;
  classPrefix: string;
  index: number;
}> = ({ slide, isActive, classPrefix, index }) => (
  <div
    className={clsx(
      styles.slide,
      `${classPrefix}slide-${index}`,
      `${classPrefix}slide`,
      isActive && styles.active,
      isActive && `${classPrefix}active`,
    )}
    style={{ backgroundImage: `url(${slide.background})` }}
    role="group"
    aria-roledescription="slide"
    aria-label={slide.alt || `Slide ${index + 1}`}
    aria-hidden={!isActive}
  ></div>
);

export default Slide;
