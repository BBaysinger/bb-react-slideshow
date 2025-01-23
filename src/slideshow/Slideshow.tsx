import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps, AUTOSLIDE_MODES } from "./Slideshow.types";
import SlideshowWrapper from "./components/SlideshowWrapper";
import SlideWrapper from "./components/SlideWrapper";
import ForegroundWrapper from "./components/ForegroundWrapper";
import ContentWrapper from "./components/ContentWrapper";
import ControlsWrapper from "./components/ControlsWrapper";
import ImagePreloader from "utils/ImagePreloader";
import Debug from "./components/Debug";
import Vignette from "./components/Vignette";

/**
 * React Slideshow Component
 *
 * A reusable and multilayered interactive slideshow that supports dynamic routing, auto-slide,
 * and multiple types of navigation, including thumbnails, steppers, pausing, and restarting.
 * It (optionally) adjusts height dynamically based on slide content to avoid overflow or
 * excessive whitespace. Also preloads images.
 *
 * Slides are defined as an array of objects with background images, thumbnails,
 * and JSX content passed in as props to make the component reusable and flexible.
 *
 * Dynamic routes (optional). They only stack the history on user interaction, and not on auto-slide.
 *
 * @param slides - An array of slide content or components
 * @param autoSlideMode - Auto-slide mode: "none", "initial" (starts on first render), "persistent" (always on)
 * @param interval - Interval in milliseconds between auto-slides
 * @param basePath - Base path for routing
 * @param enableRouting - Enables dynamic routing for slides
 * @param restartDelay - Delay in milliseconds before restarting the slideshow
 * @param transitionResetDelay - Duration of transitions that controls the 'transitioning' state and class
 * @param classPrefix - Prefix for all globally-scoped classes to avoid naming conflicts in applications
 * This is also so we don't need to rely on nesting, to avoid specificity/
 * overriding issues and prevent bloating the outputed CSS.
 * @param debug - Whether to show debugging information
 * @param labels - Custom labels for directional/stepper navigation buttons
 */
const Slideshow: React.FC<SlideshowProps> = React.memo(
  (props: SlideshowProps) => {
    const {
      slides,
      autoSlideMode = AUTOSLIDE_MODES.PERSISTENT,
      interval = 6000,
      basePath = "/slideshow",
      enableRouting = true,
      restartDelay = 12000,
      transitionResetDelay = 1600,
      classPrefix = "",
      debug = false,
      controls,
    } = props;

    // State
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [previousIndex, setPreviousIndex] = useState<number>(-1);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [currentSlug, setCurrentSlug] = useState<string>("");
    const [nextSlideTime, setNextSlideTime] = useState<number | null>(null);

    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    // Initialize routing and determine the first slide
    useEffect(() => {
      if (enableRouting && !slug) {
        navigate(`${basePath}/${slides[0].slug}`);
      }
    }, [enableRouting, basePath, navigate, slides, slug]);

    const currentRouteIndex = slug
      ? slides.findIndex((slide) => slide.slug === slug)
      : -1;

    // Update `currentIndex` based on route
    useEffect(() => {
      if (slug && currentRouteIndex !== -1) {
        setCurrentIndex(currentRouteIndex);
      }
    }, [slug, currentRouteIndex]);

    // Handle transitions
    useEffect(() => {
      if (currentIndex !== -1) {
        setPreviousIndex(currentIndex);
        setIsTransitioning(true);

        const timer = setTimeout(
          () => setIsTransitioning(false),
          transitionResetDelay,
        );
        return () => clearTimeout(timer);
      }
    }, [currentIndex, transitionResetDelay]);

    // Auto-slide logic
    useEffect(() => {
      if (!isPaused && autoSlideMode !== AUTOSLIDE_MODES.NONE) {
        const now = Date.now();
        const delay = nextSlideTime
          ? Math.max(nextSlideTime - now, 0)
          : interval;

        const timer = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
          setNextSlideTime(Date.now() + interval);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [isPaused, nextSlideTime, autoSlideMode, interval, slides.length]);

    // Start auto-slide on mount if applicable
    useEffect(() => {
      if (
        autoSlideMode === AUTOSLIDE_MODES.INITIAL ||
        autoSlideMode === AUTOSLIDE_MODES.PERSISTENT
      ) {
        setNextSlideTime(Date.now() + interval);
      }
    }, [autoSlideMode, interval]);

    // Preload images
    useEffect(() => {
      if (currentIndex !== -1) {
        const preloadOrder = [
          ...slides.slice(currentIndex).map((slide) => slide.background),
          ...slides.slice(0, currentIndex).map((slide) => slide.background),
        ];
        new ImagePreloader(preloadOrder).preload();
      }
    }, [currentIndex, slides]);

    // Update slug when the slide changes
    useEffect(() => {
      setCurrentSlug(slides[currentIndex]?.slug || "");
    }, [currentIndex, slides]);

    // Restart auto-slide after user interaction
    const delayAutoSlide = useCallback(() => {
      if (restartDelay > 0 && autoSlideMode !== AUTOSLIDE_MODES.NONE) {
        setNextSlideTime(Date.now() + restartDelay);
      }
    }, [restartDelay, autoSlideMode]);

    // Handlers for user interaction
    const handleNext = useCallback(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      delayAutoSlide();
    }, [slides.length, delayAutoSlide]);

    const handlePrev = useCallback(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      delayAutoSlide();
    }, [slides.length, delayAutoSlide]);

    const handlePauseToggle = useCallback(() => {
      setIsPaused((prev) => {
        if (prev) {
          // If resuming, immediately move to the next slide
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
          setNextSlideTime(Date.now() + interval); // Reset auto-slide timer
        }
        return !prev;
      });
    }, [slides.length, interval]);

    const handleNavigation = useCallback(
      (newIndex: number) => {
        if (enableRouting) {
          navigate(`${basePath}/${slides[newIndex].slug}`);
        } else {
          setCurrentIndex(newIndex);
        }
        delayAutoSlide();
      },
      [enableRouting, basePath, slides, navigate, delayAutoSlide],
    );

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") handlePrev();
        if (event.key === "ArrowRight") handleNext();
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);
    return (
      <SlideshowWrapper
        classPrefix={classPrefix}
        isPaused={isPaused}
        isTransitioning={isTransitioning}
        currentSlug={currentSlug}
      >
        <Debug
          isDebug={debug}
          currentIndex={currentIndex}
          previousIndex={previousIndex}
          isTransitioning={isTransitioning}
          classPrefix={classPrefix}
        />
        <SlideWrapper
          slides={slides}
          currentIndex={currentIndex}
          classPrefix={classPrefix}
        />
        <ForegroundWrapper
          slides={slides}
          currentIndex={currentIndex}
          classPrefix={classPrefix}
        />
        <Vignette classPrefix={classPrefix} />
        <ContentWrapper
          slides={slides}
          currentIndex={currentIndex}
          classPrefix={classPrefix}
        />
        <ControlsWrapper
          controls={controls}
          currentIndex={currentIndex}
          slides={slides}
          onPrev={handlePrev}
          onNext={handleNext}
          onIndex={handleNavigation}
          onTogglePause={handlePauseToggle}
          classPrefix={classPrefix}
          isPaused={isPaused}
        />
      </SlideshowWrapper>
    );
  },
);

export default Slideshow;
