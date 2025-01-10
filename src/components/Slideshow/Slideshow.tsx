import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SlideshowProps, SlideshowLabels } from "./Slideshow.types";
import ImagePreloader from "utils/ImagePreloader";
import styles from "./Slideshow.module.scss";

// Default navigation button labels
const defaultLabels: SlideshowLabels = {
  previous: "< Previous",
  next: "Next >",
  resume: "Restart",
  pause: "Pause",
};

/**
 * React Slideshow Component
 *
 * A reusable and multilayered interactive slideshow that supports dynamic routing,
 * auto-slide, and user interactions like navigation, pausing, and restarting.
 * It adjusts height dynamically based on the current slide and preloads images
 * for better performance.
 *
 * Slides are defined as an array of objects with background images, thumbnails,
 * and JSX content passed in as props to make the component reusable and flexible.
 *
 * Dynamic routes (optional) only activate on user interaction. This is so the
 * component doesn't stack the history with every auto-slide, but also because I
 * was experimenting with redux-first routing. I'll come back to that.
 *
 * NOTE: There's a lot that's untested here still, as I'm only focusing on
 * the current use case.
 *
 * @param slides - An array of slide content or components.
 * @param initialAutoSlide - Whether it should start out paused or auto-sliding.
 * @param interval - Interval in milliseconds between auto-slides.
 * @param basePath - Base path for routing.
 * @param enableRouting - Enables dynamic routing for slides.
 * @param restartDelay - Delay in milliseconds before restarting the slideshow.
 * @param transitionResetDelay - Duration of transitions, after which class names are reset to their default.
 * @param classPrefix - Prefix for all globally-scoped classes to avoid naming conflicts in applications.
 * @param debug - Whether to show debugging information.
 * @param labels - Custom labels for directional navigation buttons.
 */
const Slideshow: React.FC<SlideshowProps> = React.memo((props) => {
  const {
    slides,
    initialAutoSlide = true,
    interval = 6000,
    basePath = "/slideshow",
    enableRouting = true,
    restartDelay = 14000,
    transitionResetDelay = 1500,
    classPrefix = "",
    debug = false,
    labels = defaultLabels,
  } = props;

  // Refs
  const isFirstRender = useRef(true); // Tracks the first render
  const navigateRef = useRef(useNavigate()); // Stable ref for navigation
  const currentIndexRef = useRef<number>(-1); // Tracks the current index for stable access
  const previousIndexRef = useRef<number>(-1); // Tracks the current index for stable access
  const isPausedRef = useRef(false); // Tracks whether the slideshow is paused
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]); // Refs for individual slides
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]); // Refs for thumbnail buttons
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer for autoslide
  const preloaderRan = useRef(false); // If the preloader has run

  // States
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // Current slide index
  const [_previousIndex, setPreviousIndex] = useState<number>(-1); // Previous slide index
  const [isTransitioning, setIsTransitioning] = useState(false); // Whether a transition is in progress
  const [divHeight, setDivHeight] = useState<string>("unset"); // Height of the element, adjusted for content
  const [isPaused, setIsPaused] = useState(false); // Whether the slideshow is paused
  const [currentSlug, setCurrentSlug] = useState(""); // Current slide slug for routing

  // Hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Validate that 'basePath' is provided when routing is enabled
  if (enableRouting && !basePath) {
    console.error("'basePath' is required when routing is enabled.");
  }

  const isDebug = () => Boolean(debug);

  useEffect(() => {
    // Store the navigate function reference in a mutable ref to
    // access it outside of React's component lifecycle
    navigateRef.current = navigate;
  }, [navigate]);

  // Extract the current route's 'slug' parameter from the URL
  const { slug } = useParams<{ slug?: string }>();

  if (enableRouting && !slug) {
    // Navigate to the first slide's route if the slug is missing in the URL
    navigateRef.current(`${basePath}/${slides[0].slug}`);
  }

  useEffect(() => {
    if (enableRouting && slug) {
      const matchedIndex = slides.findIndex((slide) => slide.slug === slug);
      // Update the currentIndex to match the slug from the URL
      if (matchedIndex !== -1 && matchedIndex !== currentIndexRef.current) {
        setCurrentIndex(matchedIndex);
        delayAutoSlide();
        // currentIndexRef.current = matchedIndex;
      }
    }
  }, [slug, enableRouting, slides]);

  // Determine the index of the current slide based on the 'slug' in the URL
  // If routing is disabled, the index is set to -1 (inactive)
  const currentRouteIndex = enableRouting
    ? slides.findIndex((slide) => slide.slug === slug)
    : -1;

  useEffect(() => {
    // Timer to control the delay before resetting the transition state
    let timer: NodeJS.Timeout | null = null;

    // if (currentIndex !== -1) {
    // Update the previous index to the current one before it changes
    setPreviousIndex(currentIndexRef.current);
    previousIndexRef.current = currentIndexRef.current;

    // Set the transitioning state to true for triggering transition effects
    setIsTransitioning(true);

    // Schedule the transitioning state to reset after the specified delay
    timer = setTimeout(() => {
      setIsTransitioning(false); // End the transitioning state after the delay
    }, transitionResetDelay);
    // }

    // Update the current index reference for use in the next render
    currentIndexRef.current = currentIndex;

    // Cleanup function to clear the timeout when the effect is re-run or unmounted
    return () => {
      if (timer) {
        clearTimeout(timer); // Prevent memory leaks by ensuring the timer is cleared
      }
    };
  }, [currentIndex]); // Re-run this effect whenever the currentIndex changes

  useEffect(() => {
    /**
     * Updates the height of the container to match the current slide's height.
     * This ensures the slideshow's container dynamically adapts to the tallest
     * slide content for a seamless user experience.
     */
    const updateHeight = () => {
      const currentRef = slideRefs.current[currentIndex]; // Get the current slide's ref
      if (currentRef) {
        const height = currentRef.offsetHeight; // Measure the height of the current slide
        setDivHeight(height ? `${height}px` : "unset"); // Update the container's height
      }
    };

    updateHeight(); // Initialize height on mount or slide change

    // Update the height on window resize to ensure responsiveness
    window.addEventListener("resize", updateHeight);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentIndex]);

  useEffect(() => {
    // Ensure the preloader runs only once to avoid redundant operations
    if (!preloaderRan.current) {
      // Determine the starting index for preloading, defaulting to 0 if no
      // current index is set
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
      preloaderRan.current = true;
    }
  }, [slides]); // Re-run the effect only if the 'slides' array changes

  useEffect(() => {
    // Update the current slide's slug whenever the currentIndex or slides change
    // If no valid slide is found, default to an empty string
    setCurrentSlug(slides[currentIndex]?.slug || "");
  }, [currentIndex, slides]);

  useEffect(() => {
    // Keep the 'isPaused' state synchronized with a mutable reference
    // This allows other parts of the component to access the latest 'isPaused' value
    // without re-triggering React's rendering flow
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
  }, []); // Dependency array is empty

  const startAutoSlide = useCallback(
    (immediateSlide = false) => {
      // Clear any existing timers to ensure no duplicate intervals are running
      clearTimer();

      // Resume the auto-slide by setting the paused state to false
      setIsPaused(false);

      // Only start the auto-slide if the initialAutoSlide option is enabled
      if (initialAutoSlide) {
        // If immediateSlide is true, move to the next slide immediately
        if (immediateSlide) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }

        // Start a recurring timer to automatically change the slide at the given interval
        timerRef.current = setInterval(() => {
          // Increment the slide index, wrapping around to the first slide when the end is reached
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, interval);
      }
    },
    [
      // Dependencies: ensures the function remains stable and up-to-date
      initialAutoSlide,
      interval,
      slides.length,
      clearTimer,
    ],
  );

  const restartTimer = useCallback(() => {
    // Clear any existing timers to avoid overlapping intervals
    clearTimer();

    // If the restart delay is zero or negative, exit early as no timer should be started
    if (restartDelay <= 0) {
      return;
    }

    // Check if auto-slide is enabled and the slideshow is not currently paused
    if (initialAutoSlide && !isPausedRef.current) {
      // Immediately move to the next slide
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

      // Set up a recurring timer to continue auto-sliding at the specified interval
      timerRef.current = setInterval(() => {
        // Increment the slide index, wrapping around to the first slide after the last
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, interval);
    }
  }, [
    // Dependencies: ensure the function remains stable and up-to-date
    initialAutoSlide,
    interval,
    restartDelay,
    slides.length,
    clearTimer,
  ]);

  useEffect(() => {
    // Delay in milliseconds before triggering the first render actions
    const delay = 0;

    // Proceed only if the slideshow is not paused
    if (!isPausedRef.current) {
      if (enableRouting) {
        // Handle the first render when routing is enabled
        if (isFirstRender.current) {
          setTimeout(() => {
            if (currentRouteIndex !== -1) {
              // If the route index is valid, set the current slide to the routed slide
              setCurrentIndex(currentRouteIndex);
            } else {
              // Otherwise, navigate to the first slide and set it as the current slide
              navigateRef.current(`${basePath}/${slides[0].slug}`);
              setCurrentIndex(0);
            }
            // Mark the first render as complete
            isFirstRender.current = false;
          }, delay);
        }
      } else {
        // Handle the first render when routing is disabled
        if (isFirstRender.current) {
          setTimeout(() => {
            // Set the first slide as the current slide
            setCurrentIndex(0);
            // Mark the first render as complete
            isFirstRender.current = false;
          }, delay);
        }
      }

      // Start auto-sliding if it's the first render and auto-slide is enabled
      if (isFirstRender.current && initialAutoSlide) {
        startAutoSlide();
      }
    }
  }, [
    // Dependencies: ensure the function remains stable and up-to-date
    slug,
    currentRouteIndex,
    slides,
    navigateRef,
    startAutoSlide,
    basePath,
    enableRouting,
    initialAutoSlide,
  ]);

  useEffect(() => {
    // Ensure the current thumbnail element exists before attempting to focus it
    if (
      thumbnailRefs.current &&
      thumbnailRefs.current[currentIndexRef.current]
    ) {
      // Set focus to the thumbnail corresponding to the current slide
      // 'preventScroll: true' ensures that focusing the element doesn't cause scrolling
      if (thumbnailRefs.current[currentIndexRef.current]) {
        thumbnailRefs.current[currentIndexRef.current]!.focus({
          preventScroll: true,
        });
      }
    }
  });

  const delayAutoSlide = useCallback(() => {
    // Clear any existing timers to reset the auto-slide behavior
    clearTimer();

    // If auto-slide is enabled and a restart delay is configured
    if (restartDelay > -1 && !isPausedRef.current) {
      // Set a timeout to restart the auto-slide after the specified delay
      timerRef.current = setTimeout(() => {
        restartTimer();
      }, restartDelay);
    }
  }, [
    // Dependencies: ensure the function remains stable and up-to-date
    clearTimer,
    restartDelay,
    restartTimer,
  ]);

  const handleUserInteraction = useCallback(
    (newIndex: number) => {
      // If routing is enabled, navigate to the new slide's route
      if (enableRouting) {
        const route = `${basePath}/${slides[newIndex].slug}`;
        navigateRef.current(route); // Programmatically navigate to the new route
      } else {
        setCurrentIndex(newIndex);
      }

      delayAutoSlide();
    },
    [
      // Dependencies: ensure the function remains stable and up-to-date
      enableRouting,
      basePath,
      slides,
    ],
  );

  const handlePrevUserTriggered = useCallback(() => {
    // Calculate the new index for the previous slide
    // Wraps around to the last slide if the current slide is the first
    const newIndex: number =
      (currentIndexRef.current - 1 + slides.length) % slides.length;

    // Handle the user-triggered interaction with the calculated index
    handleUserInteraction(newIndex);
  }, [slides, handleUserInteraction]); // Dependencies: 'slides' for length and 'handleUserInteraction' for navigation

  const handleNextUserTriggered = useCallback(() => {
    // Calculate the new index for the next slide
    // Wraps around to the first slide if the current slide is the last
    const newIndex: number = (currentIndexRef.current + 1) % slides.length;

    // Handle the user-triggered interaction with the calculated index
    handleUserInteraction(newIndex);
  }, [slides, handleUserInteraction]); // Dependencies: 'slides' for length and 'handleUserInteraction' for navigation

  // Store references to the functions to maintain stable function identities across renders
  const handlePrevRef = useRef(handlePrevUserTriggered);
  const handleNextRef = useRef(handleNextUserTriggered);
  const clearTimerRef = useRef(clearTimer);

  useEffect(() => {
    // Update the refs with the latest function implementations on every render
    // This ensures the refs always point to the most up-to-date logic
    handlePrevRef.current = handlePrevUserTriggered;
    handleNextRef.current = handleNextUserTriggered;
    clearTimerRef.current = clearTimer;
  }, [handlePrevUserTriggered, handleNextUserTriggered, clearTimer]); // Dependencies: Ensure refs are updated whenever the functions change

  useEffect(() => {
    // Handle keyboard navigation for previous and next slides
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        // Trigger the "previous slide" action when the left arrow key is pressed
        handlePrevRef.current();
      } else if (event.key === "ArrowRight") {
        // Trigger the "next slide" action when the right arrow key is pressed
        handleNextRef.current();
      }
      // Additional logic for handling keyboard events would go here
    };

    // Add a global event listener for 'keydown' to enable keyboard navigation
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clear any active timers when the component unmounts or the effect re-runs
      clearTimerRef.current();
      // Remove the global 'keydown' event listener to avoid memory leaks
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const togglePause = () => {
    // Check if the slideshow is currently paused
    if (isPausedRef.current) {
      // If paused, restart the auto-slide and immediately advance to the next slide
      startAutoSlide(true);
    } else {
      // If not paused, stop the auto-slide by clearing any active timers
      clearTimer();
      // Update the paused state to true
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
                `${styles.slide} ${index === currentIndex ? styles.active : ""} ` +
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

        {/* Navigation Buttons */}
        <div
          className={`${styles["directional-button-wrapper"]} ${classPrefix}directional-button-wrapper`}
        >
          {/* Previous Slide Button */}
          {labels.previous && (
            <button
              tabIndex={0}
              onClick={handlePrevUserTriggered}
              aria-label="Previous slide"
              aria-controls="slideshow"
              className={`${styles.prevous} ${classPrefix}previous`}
            >
              {labels.previous}
            </button>
          )}

          {/* Pause/Resume Button */}
          <button
            tabIndex={0}
            onClick={togglePause}
            aria-label={isPaused ? labels.resume : labels.pause}
            className={
              `${isPaused ? styles.pause : styles.resume}` +
              `${classPrefix}${isPaused ? "pause" : "resume"}`
            }
          >
            {isPaused ? labels.resume : labels.pause}
          </button>

          {/* Next Slide Button */}
          {labels.next && (
            <button
              tabIndex={0}
              onClick={handleNextUserTriggered}
              aria-label="Next slide"
              aria-controls="slideshow"
              className={`${styles.next} ${classPrefix}next`}
            >
              {labels.next}
            </button>
          )}
        </div>

        {/* Thumbnail Navigation */}
        <div
          className={`${styles.thumbnailButtonWrapper} ${classPrefix}thumbnail-button-wrapper`}
          role="tablist"
        >
          {slides.map((_, index) => (
            <button
              tabIndex={index}
              key={index}
              ref={(el) => {
                if (thumbnailRefs.current !== null) {
                  thumbnailRefs.current[index] = el;
                }
              }}
              onClick={() => handleUserInteraction(index)}
              className={
                `${styles.thumbnail} ` +
                `${index === currentIndex ? `${styles.active} ${classPrefix}active` : ""} ` +
                `${classPrefix}thumbnail`
              }
              role="tab"
              aria-selected={index === currentIndex}
              aria-controls={`slide-${index}`}
              id={`tab-${index}`}
            >
              {slides[index].thumbnail ? (
                <img
                  src={slides[index].thumbnail}
                  alt={slides[index].alt || `Slide thumbnail ${index + 1}`}
                />
              ) : (
                <span
                  className={`${styles["visually-hidden"]} ${classPrefix}visually-hidden`}
                >{`Slide ${index + 1}`}</span>
              )}
            </button>
          ))}
        </div>

        {/* Accessibility Note */}
        <p
          className={`${styles["visually-hidden"]} ${classPrefix}visually-hidden`}
        >
          Use the left and right arrow keys to navigate the slideshow.
        </p>
      </div>
    </>
  );
});

export default Slideshow;
