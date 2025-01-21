import React, { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Slideshow from "slideshow/Slideshow";
import { SlideType } from "slideshow/Slideshow.types";
import CustomIndexedControls from "slideshow/components/CustomIndexedControls";
import { createStepperControls } from "slideshow/components/CustomStepperControls";
import CSSVariableInjector from "utils/CSSVariableInjector";
import styles from "./App.module.scss";

/**
 * Multiple demos of the Slideshow component.
 * Defines routes, initializes slide data, and configures the Slideshows.
 *
 * JSX slide content is passed along to the slideshow(s) as props along with respective data.
 * In this use case the HTML gets pre-processed to dynamically apply CSS variables
 * for crossfade animations.
 *
 * Content was added taking a cue from the SPS home page where there is content on
 * each slide. (But it's also a logical feature. And crossfades are awesome 🤘.)
 *
 * @author Bradley Baysinger
 * @since The beginning of time.
 * @version N/A
 */
const App: React.FC = () => {
  // Determine the base URL for assets and routing based on the environment
  const basePath =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_PROD_BASE_URL
      : import.meta.env.VITE_DEV_BASE_URL;

  // Array of slide data for the slideshow, including images, content, and metadata
  const slides: SlideType[] = [
    {
      slug: "ricobot",
      background: `${basePath}/assets/images/1-background.webp`,
      thumbnail: `${basePath}/assets/images/1-thumbnail.webp`,
      alt: "Rico the dog",
      title: "Rico the Dog",
      content: (
        <div>
          <h3>MORE FROM RICO THE&nbsp;DOG</h3>
          <button>RICO IS BACK!</button>
          <h2>RICOBOT</h2>
          <p>
            Charge into a brand-new supersized adventure with RICO across 50
            exciting and diverse worlds, available now&nbsp;on&nbsp;PS5!
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            LEARN MORE
          </a>
        </div>
      ),
    },
    {
      slug: "naps",
      background: `${basePath}/assets/images/2-background.webp`,
      thumbnail: `${basePath}/assets/images/2-thumbnail.webp`,
      alt: "Rico napping",
      title: "Rico Napping",
      content: (
        <div>
          <h3>CAUGHT IN THE&nbsp;ACT…</h3>
          <button>BASHFUL BULLDOG</button>
          <h2>RICO NAPS</h2>
          <p>
            Rico may be the king of the couch, but when you walk in on his
            mid-afternoon lounging session, he suddenly pretends he's never seen
            a bed before. His guilty-but-adorable side-eye is&nbsp;unmatched.
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            RICOS'S SHENANIGANS
          </a>
        </div>
      ),
    },
    {
      slug: "snow",
      background: `${basePath}/assets/images/3-background.webp`,
      thumbnail: `${basePath}/assets/images/3-thumbnail.webp`,
      alt: "Rico in the snow",
      title: "Rico in the Snow",
      content: (
        <div>
          <h3>SNOW DAY WITH&nbsp;RICO</h3>
          <button>FROSTY FUN</button>
          <h2>SNOW CHOMP</h2>
          <p>
            Rico takes winter adventures to the next level! Whether he's
            chomping on snow or leaving adorable paw prints behind, his
            enthusiasm for frosty fun is absolutely contagious. Don't miss his
            next snowy&nbsp;escapade!
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            EXPLORE MORE
          </a>
        </div>
      ),
    },
    {
      slug: "flight",
      background: `${basePath}/assets/images/4-background.webp`,
      thumbnail: `${basePath}/assets/images/4-thumbnail.webp`,
      alt: "Rico flying",
      title: "Rico Flying",
      content: (
        <div>
          <h3>FLY HIGH, RICO!</h3>
          <button>SKY-HIGH STYLE</button>
          <h2>RICO TAKES FLIGHT</h2>
          <p>
            Rico is on top of the world—literally! Whether it's a summer breeze
            or the view from above, he's the star of every outdoor adventure.
            Soak up the sunshine with this fearless flying&nbsp;Frenchie.
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            JOIN THE FUN
          </a>
        </div>
      ),
    },
    {
      slug: "birthday",
      background: `${basePath}/assets/images/5-background.webp`,
      thumbnail: `${basePath}/assets/images/5-thumbnail.webp`,
      alt: "Rico's birthday",
      title: "Rico's Birthday",
      content: (
        <div>
          <h3>IT'S RICO'S DAY!</h3>
          <button>PARTY ANIMAL</button>
          <h2>BIRTHDAY BOY</h2>
          <p>
            Rico's turning one, and he's ready to celebrate in style! With a
            cupcake in front of him and his bright yellow party hat, this pup
            knows how to steal the spotlight. Here's to the sweetest
            birthday&nbsp;ever!
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            CELEBRATE WITH RICO
          </a>
        </div>
      ),
    },
    {
      slug: "walks",
      background: `${basePath}/assets/images/6-background.webp`,
      thumbnail: `${basePath}/assets/images/6-thumbnail.webp`,
      alt: "Rico in the sun",
      title: "Rico in the Sun",
      content: (
        <div>
          <h3>SUMMER VIBES&nbsp;ONLY</h3>
          <button>WALK & ROLL</button>
          <h2>RICO'S RECHARGE</h2>
          <p>
            Nothing beats a sunny stroll for this happy pup! Rico's mid-walk
            breather, complete with closed eyes and a big panting grin, is pure
            summertime bliss. Leash up and join him for the ultimate doggy
            day&nbsp;out.
          </p>
          <a
            href="https://www.playstation.com/"
            className={`cta`}
            target="_blank"
          >
            WALK WITH RICO
          </a>
        </div>
      ),
    },
  ].map((slide) => ({
    ...slide,
    // Apply CSS variables to the content of each slide. In this demo,
    // we are using this to apply a staggered crossfade animation to the
    // content elements.
    content: CSSVariableInjector.applyChildCSSVariables(slide.content),
  }));

  const location = useLocation();

  useEffect(() => {
    // Update the document title based on the route slug
    const currentSlide = slides.find((slide) =>
      location.pathname.includes(slide.slug),
    );

    document.title = currentSlide
      ? `Rico Slideshow - ${currentSlide.title}`
      : "Rico Slideshow - Welcome";
  }, [location, slides]);

  const customLabels = {
    previous: "Back",
    next: "Forward",
    resume: "Restart",
    pause: "Pause",
  };

  const CustomStepperWithLabels = createStepperControls(customLabels);

  // Animation test slide
  const animationTest = {
    slug: "maru",
    background: `${basePath}/assets/images/7-background.webp`,
    thumbnail: `${basePath}/assets/images/7-thumbnail.webp`,
    alt: "test",
    title: "test",
    content: CSSVariableInjector.applyChildCSSVariables(
      <div className="animation-test">
        <h3>Cat in a Dog Show</h3>
        <h2>THAT'S OK, IT'S MARU</h2>
        <p>This is an animation test.</p>
        <p>Fusce quis lacus quis dui dapibus sodales non a sem.</p>
        <p>Proin dapibus erat sed convallis vehicula.</p>
        <p>Cras vitae egestas diam.</p>
        <p>Mauris eu faucibus turpis.</p>
        <p>Nullam a erat eros.</p>
        <p>Suspendisse et consequat nisi.</p>
      </div>,
    ),
  };

  // Render the application with multiple routes, each displaying a Slideshow demo
  // with different configuration options.
  return (
    <div className={`${styles["slideshow-demo"]}`}>
      <Routes>
        {/* Redirects */}
        <Route
          path="/"
          element={<Navigate to={`${basePath}/rico/ricobot`} />}
        />

        {/* All unmatched paths */}
        <Route
          path="*"
          element={<Navigate to={`${basePath}/rico/ricobot`} />}
        />

        {/* Default demo redirect */}
        <Route
          path="/rico"
          element={<Navigate to={`${basePath}/rico/ricobot`} />}
        />

        {/* Route for the primary slideshow, with dynamic slide navigation */}
        <Route
          path={`${basePath}/rico/:slug`}
          element={
            <Slideshow
              classPrefix={"demo1-"}
              slides={slides}
              basePath={`${basePath}/rico`}
              autoSlideMode={"persistent"}
              controls={[CustomIndexedControls]}
              debug={true}
            />
          }
        />

        {/* Demo 2 redirect */}
        <Route
          path="/demo2"
          element={<Navigate to={`${basePath}/demo2/ricobot`} />}
        />

        {/* Route for additional slideshow with other styling/config. */}
        <Route
          path={`${basePath}/demo2/:slug`}
          element={
            <Slideshow
              classPrefix={"demo2-"}
              slides={slides}
              basePath={`${basePath}/demo2`}
              autoSlideMode={"persistent"}
              controls={[CustomStepperWithLabels]}
              debug={true}
            />
          }
        />

        {/* Demo 3 redirect */}
        <Route
          path="/demo3"
          element={<Navigate to={`${basePath}/demo3/ricobot`} />}
        />

        {/* Route for yet another slideshow with other styling/config. */}
        {/* TODO: This should start at the initial route, even if routing is disabled */}
        <Route
          path={`${basePath}/demo3/:slug`}
          element={
            <Slideshow
              classPrefix={"demo3-"}
              slides={slides}
              basePath={`${basePath}/demo3`}
              autoSlideMode={"persistent"}
              enableRouting={false}
              controls={[CustomIndexedControls]}
              debug={true}
            />
          }
        />

        {/* Demo 4 redirect */}
        <Route
          path="/demo4"
          element={<Navigate to={`${basePath}/demo4/ricobot`} />}
        />

        {/* Animation Test and multiple sets of controls. */}
        <Route
          path={`${basePath}/demo4/:slug`}
          element={
            <Slideshow
              classPrefix={"demo4-"}
              slides={slides.concat(animationTest)}
              basePath={`${basePath}/demo4`}
              autoSlideMode={"persistent"}
              enableRouting={false}
              controls={[CustomIndexedControls, CustomStepperWithLabels]}
              debug={true}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
