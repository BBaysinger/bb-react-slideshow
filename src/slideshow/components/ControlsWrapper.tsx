import React from "react";
import clsx from "clsx";

import {
  SlideshowControlType,
  SlideType,
  SlideshowLabels,
} from "../Slideshow.types";
import styles from "./Slideshow.module.scss";

export const ControlsWrapper: React.FC<
  Parameters<SlideshowControlType>[0] & {
    controls?: SlideshowControlType[] | undefined;
    slides: SlideType[];
  }
> = ({
  controls,
  currentIndex,
  slides,
  onPrev,
  onNext,
  onIndex,
  onTogglePause,
  isPaused,
  labels,
  classPrefix,
}) => (
  <div
    className={clsx(
      styles["controls-wrapper"],
      `${classPrefix}controls-wrapper`,
    )}
  >
    {controls?.map((Control, index) => (
      <Control
        key={index}
        currentIndex={currentIndex}
        slides={slides}
        onPrev={onPrev}
        onNext={onNext}
        onIndex={onIndex ?? (() => {})}
        onTogglePause={onTogglePause}
        isPaused={isPaused}
        labels={labels ?? ({} as SlideshowLabels)}
        classPrefix={classPrefix}
      />
    ))}
  </div>
);

export default ControlsWrapper;
