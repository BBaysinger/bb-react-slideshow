import { SlideshowLabels, SlideshowControl } from "./Slideshow.types";
import styles from "./CustomStepperControls.module.scss";

const CustomStepperControls: SlideshowControl = ({
  onPrev,
  onNext,
  labels = defaultLabels,
  onTogglePause,
  isPaused,
  classPrefix = "",
}) => (
  <div className="custom-stepper-controls">
    <div
      className={`${styles["stepper-button-wrapper"]} ${classPrefix}stepper-button-wrapper`}
    >
      {/* Previous Slide Button */}
      {labels?.previous && (
        <button
          tabIndex={0}
          onClick={onPrev}
          aria-label="Previous slide"
          aria-controls="slideshow"
          className={`${styles.previous} ${classPrefix}previous`}
        >
          {labels.previous}
        </button>
      )}

      {/* Pause/Resume Button */}
      <button
        tabIndex={0}
        onClick={onTogglePause}
        aria-label={isPaused ? labels?.resume : labels?.pause}
        className={
          `${isPaused ? styles.resume : styles.pause} ` +
          `${classPrefix}${isPaused ? "resume" : "pause"}`
        }
      >
        {isPaused ? labels?.resume : labels?.pause}
      </button>

      {/* Next Slide Button */}
      {labels?.next && (
        <button
          tabIndex={0}
          onClick={onNext}
          aria-label="Next slide"
          aria-controls="slideshow"
          className={`${styles.next} ${classPrefix}next`}
        >
          {labels.next}
        </button>
      )}
    </div>
  </div>
);

// Default navigation button labels
const defaultLabels: SlideshowLabels = {
  previous: "< Previous",
  next: "Next >",
  resume: "Restart",
  pause: "Pause",
};

// Factory function to create custom stepper controls with custom labels.
export const createStepperControls = (
  customLabels: SlideshowLabels,
): SlideshowControl => {
  return ({ onPrev, onNext, labels }) => (
    <div className="custom-stepper-controls">
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className="stepper-prev"
      >
        {customLabels.previous || labels?.previous || "←"}
      </button>
      <button onClick={onNext} aria-label="Next slide" className="stepper-next">
        {customLabels.next || labels?.next || "→"}
      </button>
    </div>
  );
};

export default CustomStepperControls;
