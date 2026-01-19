import React from "react";
import clsx from "clsx";

import { SlideType } from "../Slideshow.types";
import Slide from "./Slide";
import styles from "./Slideshow.module.scss";

const SlideWrapper: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => (
  <div className={clsx(styles["slide-wrapper"], `${classPrefix}slide-wrapper`)}>
    {slides.map((slide, index) => (
      <Slide
        key={index}
        slide={slide}
        isActive={index === currentIndex}
        classPrefix={classPrefix}
        index={index}
      />
    ))}
  </div>
);

export default SlideWrapper;
