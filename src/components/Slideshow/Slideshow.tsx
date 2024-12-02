import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps } from "./Slideshow.types";
import ImagePreloader from "utils/ImagePreloader";
import styles from "./Slideshow.module.scss";
import useTimer from "utils/useTimer";

const Slideshow: React.FC<SlideshowProps> = ({
  slides,
  initialAutoSlide = true,
  interval = 6000,
  basePath = "/slideshow",
  enableRouting = true,
  restartDelay = 14000,
  previousLabel = "< Previous",
  nextLabel = "Next >",
  resumeLabel = "Restart",
  pauseLabel = "Pause",
  resetDelay = 500, // Delay for removing 'previous' class
}) => {
  const isFirstRender = useRef(true);
  const stableSlides = useMemo(() => slides, [slides]);

  if (enableRouting && !basePath) {
    console.error("'basePath' is required when routing is enabled.");
  }

  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const { slug } = useParams<{ slug?: string }>();
  if (enableRouting && !slug) {
    navigateRef.current(`${basePath}/${slides[0].slug}`);
  }

  const currentRouteIndex = enableRouting
    ? stableSlides.findIndex((slide) => slide.slug === slug)
    : -1;

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const currentIndexRef = useRef<number>(currentIndex);

  const [divHeight, setDivHeight] = useState<string>("unset");
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]); // Array of refs

  useEffect(() => {
    const updateHeight = () => {
      const currentRef = slideRefs.current[currentIndex];
      if (currentRef) {
        const height = currentRef.offsetHeight;
        setDivHeight(height ? `${height}px` : "unset");
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentIndex]);

  const preloaderRan = useRef(false);

  useEffect(() => {
    if (!preloaderRan.current) {
      const preloadIndex =
        currentIndexRef.current >= 0 ? currentIndexRef.current : 0;

      const reorderedSources = [
        ...slides.slice(preloadIndex).map((slide) => slide.background),
        ...slides.slice(0, preloadIndex).map((slide) => slide.background),
      ];

      const preloader = new ImagePreloader(reorderedSources);
      preloader.preload();

      preloaderRan.current = true;
    }
  }, [slides]);

  useEffect(() => {
    setPreviousIndex(currentIndexRef.current);
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const [previousIndex, setPreviousIndex] = useState<number | null>(null);

  const { reset: resetPreviousIndexTimer } = useTimer(resetDelay, () => {
    setPreviousIndex(null);
  });

  const [currentSlug, setCurrentSlug] = useState(
    stableSlides[currentIndex]?.slug || "",
  );

  useEffect(() => {
    setCurrentSlug(stableSlides[currentIndex]?.slug || "");
  }, [currentIndex, stableSlides]);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<HTMLButtonElement[]>([]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(
    (immediateSlide = false) => {
      clearTimer();
      setIsPaused(false);
      // TODO: Is this the appropriate condition?
      if (initialAutoSlide) {
        if (immediateSlide) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
        }
        timerRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
        }, interval);
      }
    },
    [initialAutoSlide, interval, stableSlides.length, clearTimer],
  );

  const restartTimer = useCallback(() => {
    clearTimer();

    if (restartDelay <= 0) {
      return;
    }

    if (initialAutoSlide && !isPausedRef.current) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stableSlides.length);
      }, interval);
    }
  }, [
    initialAutoSlide,
    interval,
    restartDelay,
    stableSlides.length,
    clearTimer,
  ]);

  useEffect(() => {
    const delay = 1000;
    if (!isPausedRef.current) {
      if (enableRouting) {
        if (isFirstRender.current) {
          setTimeout(() => {
            if (currentRouteIndex !== -1) {
              setCurrentIndex(currentRouteIndex);
            } else {
              navigateRef.current(`${basePath}/${stableSlides[0].slug}`);
              setCurrentIndex(0);
            }
            isFirstRender.current = false;
          }, delay);
        }
      } else {
        if (isFirstRender.current) {
          setTimeout(() => {
            setCurrentIndex(0);
            isFirstRender.current = false;
          }, delay);
        }
      }
      if (!isFirstRender.current || initialAutoSlide) {
        startAutoSlide();
      }
    }
  }, [
    slug,
    currentRouteIndex,
    stableSlides,
    navigateRef,
    startAutoSlide,
    basePath,
    enableRouting,
    initialAutoSlide,
  ]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndexRef.current]) {
      thumbnailRefs.current[currentIndexRef.current].focus({
        preventScroll: true,
      });
    }
  });

  const handleUserInteraction = useCallback(
    (newIndex: number) => {
      setPreviousIndex(currentIndex);
      resetPreviousIndexTimer();
      setCurrentIndex(newIndex);
      if (enableRouting) {
        const route = `${basePath}/${stableSlides[newIndex].slug}`;
        navigateRef.current(route);
      }
      clearTimer();

      if (restartDelay > 0 && !isPausedRef.current) {
        timerRef.current = setTimeout(() => {
          restartTimer();
        }, restartDelay);
      }
    },
    [
      currentIndex,
      resetPreviousIndexTimer,
      restartDelay,
      restartTimer,
      clearTimer,
      enableRouting,
      basePath,
      stableSlides,
    ],
  );

  const handlePrevUserTriggered = useCallback(() => {
    const newIndex: number =
      (currentIndexRef.current - 1 + stableSlides.length) % stableSlides.length;
    handleUserInteraction(newIndex);
  }, [stableSlides, handleUserInteraction]);

  const handleNextUserTriggered = useCallback(() => {
    const newIndex: number =
      (currentIndexRef.current + 1) % stableSlides.length;
    handleUserInteraction(newIndex);
  }, [stableSlides, handleUserInteraction]);

  const handlePrevRef = useRef(handlePrevUserTriggered);
  const handleNextRef = useRef(handleNextUserTriggered);
  const clearTimerRef = useRef(clearTimer);

  useEffect(() => {
    handlePrevRef.current = handlePrevUserTriggered;
    handleNextRef.current = handleNextUserTriggered;
    clearTimerRef.current = clearTimer;
  }, [handlePrevUserTriggered, handleNextUserTriggered, clearTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevRef.current();
      } else if (event.key === "ArrowRight") {
        handleNextRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      console.log("removeEventListener");
      clearTimerRef.current();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const togglePause = () => {
    if (isPausedRef.current) {
      startAutoSlide(true);
    } else {
      clearTimer();
      setIsPaused(true);
    }
  };

  return (
    <>
      <div
        style={{
          color: "#000",
          zIndex: 100,
          position: "absolute",
          display: "none",
        }}
      >{`${previousIndex} ${currentIndex}`}</div>

      <div
        className={`${styles.bbaysingerSlideshow} bbaysinger-slideshow slideshow-slide-${currentSlug}`}
        aria-roledescription="carousel"
        aria-label="Slideshow"
        aria-live="polite"
      >
        <div className={`${styles.slideWrapper} slide-wrapper`}>
          {stableSlides.map((slide, index) => (
            <div
              tabIndex={index === currentIndex ? 0 : -1}
              key={index}
              className={`${styles.slide} ${
                index === currentIndex ? styles.active : ""
              }`}
              style={{
                backgroundImage: `url(${slide.background})`,
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${
                slide.alt || `Slide ${index + 1} of ${stableSlides.length}`
              }`}
              aria-hidden={index !== currentIndex}
            ></div>
          ))}
        </div>

        <div
          className={`${styles.overlayWrapper1} overlay-wrapper overlay-wrapper-1`}
        >
          {stableSlides.map((_, index) => (
            <div
              key={index}
              className={`
                overlay-1-${index + 1} 
                ${styles.overlay} 
                overlay 
                ${index === currentIndex ? `${styles.active} active` : ""} 
                ${index === previousIndex ? `${styles.previous} previous` : ""}
              `}
            ></div>
          ))}
        </div>
        <div
          className={`${styles.overlayWrapper2} overlay-wrapper overlay-wrapper-2`}
        >
          {/* TODO: Consider populating overlay wrappers as needed
          from props/configuration. */}
        </div>

        <div
          style={{ height: divHeight }}
          className={`${styles.contentWrapper} content-wrapper`}
        >
          {stableSlides.map((_, index) => (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className={`${styles.content} content ${
                index === currentIndex ? styles.active + " active " : ""
              } ${
                index === previousIndex ? styles.previous + " previous" : ""
              }`}
            >
              {stableSlides[index].content}
            </div>
          ))}
        </div>

        <div className={`${styles.arrowButtonWrapper} arrow-button-wrapper`}>
          {previousLabel && (
            <button
              onClick={handlePrevUserTriggered}
              aria-label="Previous slide"
              aria-controls="slideshow"
            >
              {previousLabel}
            </button>
          )}
          <button
            onClick={togglePause}
            aria-label={isPausedRef.current ? resumeLabel : pauseLabel}
          >
            {isPausedRef.current ? resumeLabel : pauseLabel}
          </button>
          {nextLabel && (
            <button
              onClick={handleNextUserTriggered}
              aria-label="Next slide"
              aria-controls="slideshow"
            >
              {nextLabel}
            </button>
          )}
        </div>

        <div
          className={`${styles.thumbnailButtonWrapper} thumbnail-button-wrapper`}
          role="tablist"
        >
          {stableSlides.map((_, index) => (
            <button
              key={index}
              ref={(el) => (thumbnailRefs.current[index] = el!)}
              onClick={() => handleUserInteraction(index)}
              className={`${styles.thumbnail} ${
                index === currentIndex ? `${styles.active} active` : ""
              } thumbnail`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-controls={`slide-${index}`}
              id={`tab-${index}`}
            >
              {stableSlides[index].thumbnail ? (
                <img
                  src={stableSlides[index].thumbnail}
                  alt={
                    stableSlides[index].alt || `Slide thumbnail ${index + 1}`
                  }
                />
              ) : (
                <span className="visually-hidden">{`Slide ${index + 1}`}</span>
              )}
            </button>
          ))}
        </div>
        <p className={`${styles.visuallyHidden} visually-hidden`}>
          Use the left and right arrow keys to navigate the slideshow.
        </p>
      </div>
    </>
  );
};

export default Slideshow;