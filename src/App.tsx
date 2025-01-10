import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Slideshow from "components/Slideshow/Slideshow";
import { Slide } from "components/Slideshow/Slideshow.types";
import CSSVariableInjector from "utils/CSSVariableInjector";

import styles from "./App.module.scss";

/**
 * Multiple demos of the Slideshow component.
 * Defines routes, initializes slide data, and configures the Slideshow.
 *
 * JSX slide content is passed along to the slideshow(s) as props along with respective data.
 * In this use case the HTML gets pre-processed to dynamically apply CSS variables
 * for crossfade animations.
 *
 * The content was added taking a cue from the SPS home page where there is content on
 * each slide, but also that it's a logical feature. And crossfades are awesome 🤘.
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
  const slides: Slide[] = [
    {
      slug: "one",
      background: `${basePath}/assets/images/1-background.jpg`,
      thumbnail: `${basePath}/assets/images/1-thumbnail.jpg`,
      alt: "Rico the dog",
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
      slug: "two",
      background: `${basePath}/assets/images/2-background.jpg`,
      thumbnail: `${basePath}/assets/images/2-thumbnail.jpg`,
      alt: "Rico napping",
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
      slug: "three",
      background: `${basePath}/assets/images/3-background.jpg`,
      thumbnail: `${basePath}/assets/images/3-thumbnail.jpg`,
      alt: "Rico in the snow",
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
      slug: "four",
      background: `${basePath}/assets/images/4-background.jpg`,
      thumbnail: `${basePath}/assets/images/4-thumbnail.jpg`,
      alt: "Rico flying",
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
      slug: "five",
      background: `${basePath}/assets/images/5-background.jpg`,
      thumbnail: `${basePath}/assets/images/5-thumbnail.jpg`,
      alt: "Rico's birthday",
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
      slug: "six",
      background: `${basePath}/assets/images/6-background.jpg`,
      thumbnail: `${basePath}/assets/images/6-thumbnail.jpg`,
      alt: "Rico in the sun",
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

  // Render the application with two routes, each displaying a Slideshow component
  // with different configuration options.
  return (
    <div className={`${styles["slideshow-demo"]}`}>
      <BrowserRouter>
        <Routes>
          {/* Redirect */}
          <Route
            path="/"
            element={<Navigate to={`${basePath}/rico-slideshow/one`} />}
          />

          {/* Redirect */}
          <Route
            path="/rico-slideshow"
            element={<Navigate to={`${basePath}/rico-slideshow/one`} />}
          />

          {/* Route for the primary slideshow, with dynamic slide navigation */}
          <Route
            path={`${basePath}/rico-slideshow/:slug`}
            element={
              <Slideshow
                classPrefix={"prefix-one-"}
                slides={slides}
                basePath={`${basePath}/rico-slideshow`}
                initialAutoSlide={true}
                debug={true}
              />
            }
          />

          {/* Redirect */}
          <Route
            path="/another-config"
            element={<Navigate to={`${basePath}/another-config/one`} />}
          />

          {/* Route for additional slideshow with other config options. */}
          <Route
            path={`${basePath}/another-config/:slug`}
            element={
              <Slideshow
                classPrefix={"prefix-two-"}
                slides={slides}
                basePath={`${basePath}/another-config`}
                initialAutoSlide={true}
                debug={true}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
