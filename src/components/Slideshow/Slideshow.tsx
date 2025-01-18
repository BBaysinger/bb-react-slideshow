import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps, AUTOSLIDE_MODES } from "./Slideshow.types";
import ImagePreloader from "utils/ImagePreloader";
import styles from "./Slideshow.module.scss";

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

    // Refs
    const isFirstRender = useRef(true); // Tracks the first render
    const currentIndexRef = useRef<number>(-1); // Tracks the current index for stable access
    const previousIndexRef = useRef<number>(-1); // Tracks the previous index for stable access
    const isPausedRef = useRef(false); // Tracks whether the slideshow is paused
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for individual slides
    // const indexedButtonRefs = useRef<(HTMLButtonElement | null)[]>([]); // Refs for indexed buttons (thumbnails or dots)
    const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer for auto-slide
    const preloaderRanRef = useRef(false); // If the preloader has run
    const autoSlideCounterRef = useRef(0); // Counter for auto-slide intervals
    const isInternalNavigation = useRef(false);

    // States
    const [currentIndex, setCurrentIndex] = useState<number>(-1); // Current slide index
    const [_previousIndex, setPreviousIndex] = useState<number>(-1); // Previous slide index
    const [isTransitioning, setIsTransitioning] = useState(false); // Whether a transition is in progress
    const [divHeight, setDivHeight] = useState<string>("unset"); // Height of the element, adjusted for content
    const [isPaused, setIsPaused] = useState(false); // Whether the slideshow is paused
    const [currentSlug, setCurrentSlug] = useState(""); // Current slide slug for routing

    const navigate = useNavigate();
    const isDebug = () => Boolean(debug);
    const { slug } = useParams<{ slug?: string }>(); // Routing slug from the URL

    // Validate that 'basePath' is provided when routing is enabled
    if (enableRouting && !basePath) {
      console.error("'basePath' is required when routing is enabled.");
    }

    if (enableRouting && !slug) {
      // Navigate to the first slide's route if the slug is missing in the URL
      navigate(`${basePath}/${slides[0].slug}`);
    }

    // Determine the index of the current slide based on the 'slug' in the URL
    // If routing is disabled, the index is set to -1 (inactive)
    const currentRouteIndex = slug
      ? slides.findIndex((slide) => slide.slug === slug)
      : -1;

    useEffect(() => {
      // Timer to control the delay before resetting the transition state
      let timer: NodeJS.Timeout | null = null;

      // Update the previous index to the current one before it changes
      setPreviousIndex(currentIndexRef.current);
      previousIndexRef.current = currentIndexRef.current;

      // Update the current index reference for use in the next render
      currentIndexRef.current = currentIndex;

      // Set the transitioning state to true for triggering transition effects
      setIsTransitioning(true);

      // Schedule the transitioning state to reset after the specified delay
      timer = setTimeout(() => {
        setIsTransitioning(false); // End the transitioning state after the delay
      }, transitionResetDelay);

      // Cleanup function to clear the timeout when the effect is re-run or unmounted
      return () => {
        if (timer) {
          clearTimeout(timer); // Prevent memory leaks by ensuring the timer is cleared
        }
      };
    }, [currentIndex, transitionResetDelay]);

    useEffect(() => {
      // Updates the height of the container to match the current slide's height.
      // to reduce whitespace and avoid overflow issues.
      const updateHeight = () => {
        const currentSlide = slideRefs.current[currentIndex];
        if (currentSlide) {
          const height = currentSlide.offsetHeight;
          setDivHeight(height ? `${height}px` : "unset");
        }
      };

      updateHeight();

      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }, [currentIndex]);

    useEffect(() => {
      // Ensure the preloader runs only once to avoid redundant operations
      if (!preloaderRanRef.current) {
        // Determine the starting index for preloading
        const preloadIndex =
          currentIndexRef.current >= 0 ? currentIndexRef.current : 0;

        // Reorder the slide backgrounds to start preloading from the current index
        const reorderedSources = [
          // Backgrounds from the current index to the end
          ...slides.slice(preloadIndex).map((slide) => slide.background),
          // Backgrounds from the start to the current index
          ...slides.slice(0, preloadIndex).map((slide) => slide.background),
        ];

        // Initialize and start preloading the reordered backgrounds
        const preloader = new ImagePreloader(reorderedSources);
        preloader.preload();

        // Mark the preloader as having run to prevent repeated preloading
        preloaderRanRef.current = true;
      }
    }, [slides]);

    useEffect(() => {
      // Update the current slide's slug whenever the currentIndex or slides change
      setCurrentSlug(slides[currentIndex]?.slug || "");
    }, [currentIndex, slides]);

    useEffect(() => {
      // Keep the 'isPaused' state synchronized and avoid stale values
      isPausedRef.current = isPaused;
    }, [isPaused]);

    const clearTimer = useCallback(() => {
      // Check if there is an active timer stored in the reference
      if (timerRef.current) {
        // Clear the timeout to stop any delayed function execution
        clearTimeout(timerRef.current);

        // Clear the interval to stop any repeating function execution
        clearInterval(timerRef.current);

        // Reset the timer reference to null to indicate no active timer
        timerRef.current = null;
      }
    }, []);

    const startAutoSlide = useCallback(
      (immediateSlide = false) => {
        // Clear any existing timers to ensure no duplicate intervals are running
        clearTimer();

        // Resume the auto-slide by setting the paused state to false
        setIsPaused(false);

        // if (autoSlideMode === AUTOSLIDE_MODES.PERSISTENT) {
        const doAutoSlide = (index: number) => {
          const newIndex = index % slides.length;
          if (enableRouting) {
            // Come back to this. It's not consistent, and Chrome seems to have
            // a defect to do with dynamic routing history that I'm observing here
            // and in another project. 😡
            // isInternalNavigation.current = true;
            // navigate(`${basePath}/${slides[newIndex].slug}`, {
            //   replace: autoSlideCounterRef.current > 0,
            // });
            setCurrentIndex(newIndex);
          } else {
            setCurrentIndex(newIndex);
          }

          autoSlideCounterRef.current += 1;
        };

        // Move to the next slide immediately after unpausing
        if (immediateSlide) {
          doAutoSlide(currentIndexRef.current + 1);
        }

        // Start a recurring timer to automatically change the slide at the given interval
        timerRef.current = setInterval(() => {
          doAutoSlide(currentIndexRef.current + 1);
        }, interval);
      },
      [
        autoSlideMode,
        interval,
        slides,
        enableRouting,
        basePath,
        navigate,
        clearTimer,
      ],
    );

    useEffect(() => {
      if (!isPausedRef.current) {
        if (slug) {
          // Handle the first render when routing is enabled
          if (isFirstRender.current) {
            requestAnimationFrame(() => {
              if (currentRouteIndex !== -1) {
                // If the route index is valid, set the current slide to the routed slide
                setCurrentIndex(currentRouteIndex);
              } else {
                // Otherwise, navigate to the first slide and set it as the current slide
                navigate(`${basePath}/${slides[0].slug}`);
              }
              // Mark the first render as complete
              isFirstRender.current = false;
            });
          }
        } else {
          // Handle the first render when routing is disabled
          if (isFirstRender.current) {
            requestAnimationFrame(() => {
              // Set the first slide as the current slide
              setCurrentIndex(0);
              // Mark the first render as complete
              isFirstRender.current = false;
            });
          }
        }

        // Start auto-sliding if it's the first render and auto-slide is enabled
        if (
          isFirstRender.current &&
          (autoSlideMode === AUTOSLIDE_MODES.INITIAL ||
            autoSlideMode === AUTOSLIDE_MODES.PERSISTENT)
        ) {
          startAutoSlide();
        }
      }
    }, [
      slug,
      currentRouteIndex,
      slides,
      startAutoSlide,
      basePath,
      enableRouting,
      autoSlideMode,
    ]);

    const delayAutoSlide = useCallback(() => {
      // Clear any existing timers to reset the auto-slide behavior
      clearTimer();

      // If auto-slide is enabled and a restart delay is configured
      if (
        restartDelay > -1 &&
        !isPausedRef.current &&
        autoSlideMode !== AUTOSLIDE_MODES.NONE
      ) {
        // Set a timeout to restart the auto-slide after the specified delay
        timerRef.current = setTimeout(() => {
          startAutoSlide(true);
        }, restartDelay);
      }
    }, [clearTimer, restartDelay, startAutoSlide]);

    useEffect(() => {
      if (slug) {
        const matchedIndex = slides.findIndex((slide) => slide.slug === slug);
        // Update the currentIndex to match the slug from the URL
        if (matchedIndex !== -1 && matchedIndex !== currentIndexRef.current) {
          setCurrentIndex(matchedIndex);

          if (isInternalNavigation.current) {
            // Reset the flag for future navigations
            isInternalNavigation.current = false;
          } else {
            // External navigation (e.g., browser history buttons)
            autoSlideCounterRef.current = 0;
            delayAutoSlide();
          }
        }
      }
    }, [slug, slides, delayAutoSlide]);

    const handleUserInteraction = useCallback(
      (newIndex: number) => {
        autoSlideCounterRef.current = 0;
        // If routing is enabled, navigate to the new slide's route
        if (enableRouting) {
          isInternalNavigation.current = true;
          navigate(`${basePath}/${slides[newIndex].slug}`);
        } else {
          setCurrentIndex(newIndex);
        }

        delayAutoSlide();
      },
      [enableRouting, basePath, slides],
    );

    const handlePrevUserTriggered = useCallback(() => {
      // Calculate the new index for the previous slide
      const newIndex: number =
        (currentIndexRef.current - 1 + slides.length) % slides.length;

      handleUserInteraction(newIndex);
    }, [slides, handleUserInteraction]);

    const handleNextUserTriggered = useCallback(() => {
      // Calculate the new index for the next slide
      const newIndex: number = (currentIndexRef.current + 1) % slides.length;

      handleUserInteraction(newIndex);
    }, [slides, handleUserInteraction]);

    useEffect(() => {
      // Handle keyboard navigation for previous and next slides
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
          // Trigger the "previous slide" action when the left arrow key is pressed
          handlePrevUserTriggered();
        } else if (event.key === "ArrowRight") {
          // Trigger the "next slide" action when the right arrow key is pressed
          handleNextUserTriggered();
        }
      };

      // Add a global event listener for 'keydown' to enable keyboard navigation
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        // Clear any active timers when the component unmounts or the effect re-runs
        clearTimer();
        // Remove the global 'keydown' event listener to avoid memory leaks
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);

    const togglePause = () => {
      if (isPausedRef.current) {
        // If paused, restart the auto-slide and immediately advance to the next slide
        startAutoSlide(true);
      } else {
        // If not paused, stop the auto-slide by clearing any active timers
        clearTimer();
        setIsPaused(true);
      }
    };

    return (
      <>
        {/* Debugging Information (Hidden by default) */}
        {isDebug() && (
          <div className={`${styles["debug"]} ${classPrefix}debug`}>
            {`curr: ${currentIndexRef.current} prev: ${previousIndexRef.current} ` +
              `transitioning: ${isTransitioning}`}
          </div>
        )}

        {/* Slideshow Wrapper */}
        <div
          className={
            `${styles["slideshow-wrapper"]} ${classPrefix}slideshow ` +
            `${classPrefix}slideshow-slide-${currentSlug} ` +
            `${isTransitioning ? `${styles.transitioning} ${classPrefix}transitioning` : ""}` +
            `${isPaused ? `${styles.paused} ${classPrefix}paused` : ""}`
          }
          aria-roledescription="carousel"
          aria-label="Slideshow"
          aria-live="polite"
          aria-busy={isTransitioning}
        >
          {/* Slide Elements */}
          <div
            className={`${styles["slide-wrapper"]} ${classPrefix}slide-wrapper`}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={
                  `${styles.slide} ${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} ` +
                  `${classPrefix}slide-${index} ${classPrefix}slide`
                }
                style={{
                  backgroundImage: `url(${slide.background})`,
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slide.alt || `Slide ${index + 1} of ${slides.length}`}`}
                aria-hidden={index !== currentIndex}
              ></div>
            ))}
          </div>

          {/* Overlay Layers for Visual Effects */}
          <div
            className={
              `${styles["overlay-wrapper-1"]} ` +
              `${classPrefix}overlay-wrapper ${classPrefix}overlay-wrapper-1`
            }
          >
            {slides.map((_, index) => (
              <div
                key={index}
                className={
                  `${classPrefix}overlay-1-${index + 1} ` +
                  `${styles.overlay} ${classPrefix}overlay ` +
                  `${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} ` +
                  `${index === previousIndexRef.current && isTransitioning ? ` ${classPrefix}previous` : ""}`
                }
              ></div>
            ))}
          </div>
          <div
            className={
              `${styles["overlay-wrapper-2"]} ` +
              `${classPrefix}overlay-wrapper ${classPrefix}overlay-wrapper-2`
            }
          ></div>

          {/* Content Wrapper */}
          <div
            style={{ height: divHeight }}
            className={`${styles["content-wrapper"]} ${classPrefix}content-wrapper`}
          >
            {slides.map((_, index) => (
              <div
                key={index}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                className={
                  `${styles.content} ${classPrefix}content ` +
                  `${index === currentIndex ? styles.active + ` ${classPrefix}active` : ""} ` +
                  `${index === previousIndexRef.current ? `${classPrefix}previous` : ""}`
                }
              >
                {slides[index].content}
              </div>
            ))}
          </div>

          <div>
            {controls?.map((SlideshowControl, index) => (
              <SlideshowControl
                key={index}
                currentIndex={currentIndex}
                slides={slides}
                onPrev={handlePrevUserTriggered}
                onNext={handleNextUserTriggered}
                onIndex={handleUserInteraction}
                onTogglePause={togglePause}
                classPrefix={classPrefix}
                isPaused={isPaused}
              />
            ))}
          </div>
        </div>
      </>
    );
  },
);

export default Slideshow;
