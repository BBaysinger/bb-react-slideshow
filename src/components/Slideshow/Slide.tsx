import React from "react";

import { SlideType } from "./Slideshow.types";

const Slide: React.FC<{
  slide: SlideType;
  isActive: boolean;
  classPrefix: string;
  index: number;
}> = ({ slide, isActive, classPrefix, index }) => (
  <div
    className={`${classPrefix}slide ${isActive ? `${classPrefix}active` : ""}`}
    style={{ backgroundImage: `url(${slide.background})` }}
    role="group"
    aria-roledescription="slide"
    aria-label={slide.alt || `Slide ${index + 1}`}
    aria-hidden={!isActive}
  ></div>
);

export default Slide;
