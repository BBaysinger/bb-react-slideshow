import React from "react";

import { SlideshowControlType, SlideType } from "./Slideshow.types";
import { SlideshowLabels } from "./Slideshow.types";

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
  <div>
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
