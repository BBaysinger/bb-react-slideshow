import { Route, Routes, BrowserRouter } from "react-router-dom";

import Slideshow from "components/Slideshow/Slideshow";
import { Slide } from "components/Slideshow/Slideshow.types";
import CSSVariableInjector from "utils/CSSVariableInjector";

import "./App.scss";

function App() {
  const slides: Slide[] = [
    {
      slug: "one",
      background: "/assets/images/1-background.jpg",
      thumbnail: "/assets/images/1-thumbnail.jpg",
      desc: "",
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
            className="bb-cta"
            target="_blank"
          >
            LEARN MORE
          </a>
        </div>
      ),
    },
    {
      slug: "two",
      background: "/assets/images/2-background.jpg",
      thumbnail: "/assets/images/2-thumbnail.jpg",
      desc: "",
      alt: "Rico napping",
      content: (
        <div>
          <h3>CAUGHT IN THE&nbsp;ACT…</h3>
          <button>Bashful Bulldog Blues</button>
          <h2>RICO NAPS</h2>
          <p>
            Rico may be the king of the couch, but when you walk in on his
            mid-afternoon lounging session, he suddenly pretends he's never seen
            a bed before. His guilty-but-adorable
            side-eye is&nbsp;unmatched.
          </p>
          <a
            href="https://www.playstation.com/"
            className="bb-cta"
            target="_blank"
          >
            RICOS'S SHENANIGANS
          </a>
        </div>
      ),
    },
    {
      slug: "three",
      background: "/assets/images/3-background.jpg",
      thumbnail: "/assets/images/3-thumbnail.jpg",
      desc: "",
      alt: "Rico in the snow",
      content: (
        <div>
          <h3>SNOW DAY WITH&nbsp;RICO</h3>
          <button>FROSTY FUN</button>
          <h2>SNOW CHOMP</h2>
          <p>
            Rico takes winter adventures to the next level! Whether he's chomping 
            on snow or leaving adorable paw prints behind, his enthusiasm for 
            frosty fun is absolutely contagious. Don't miss his next snowy&nbsp;escapade!
          </p>
          <a
            href="https://www.playstation.com/"
            className="bb-cta"
            target="_blank"
          >
            EXPLORE MORE
          </a>
        </div>
      ),
    },
    {
      slug: "four",
      background: "/assets/images/4-background.jpg",
      thumbnail: "/assets/images/4-thumbnail.jpg",
      desc: "",
      alt: "Rico flying",
      content: (
        <div>
          <h3>FLY HIGH, RICO!</h3>
          <button>SKY-HIGH STYLE</button>
          <h2 className="">RICO TAKES FLIGHT</h2>
          <p>
            Rico is on top of the world—literally! Whether it's a summer breeze or the
            view from above, he’s the star of every outdoor adventure. 
            Soak up the sunshine with this fearless flying&nbsp;Frenchie.
          </p>
          <a
            href="https://www.playstation.com/"
            className="bb-cta"
            target="_blank"
          >
            JOIN THE FUN
          </a>
        </div>
      ),
    },
    {
      slug: "five",
      background: "/assets/images/5-background.jpg",
      thumbnail: "/assets/images/5-thumbnail.jpg",
      desc: "",
      alt: "Rico's birthday",
      content: (
        <div>
          <h3>IT'S RICO'S&nbsp;DAY!</h3>
          <button>PARTY ANIMAL</button>
          <h2>BIRTHDAY BOY</h2>
          <p>
            Rico's turning one, and he's ready to celebrate in style! With a cupcake 
            in front of him and his bright yellow party hat, this pup knows how to 
            steal the spotlight. Here's to the sweetest birthday&nbsp;ever!
          </p>
          <a
            href="https://www.playstation.com/"
            className="bb-cta"
            target="_blank"
          >
            CELEBRATE WITH RICO
          </a>
        </div>
      ),
    },
    {
      slug: "six",
      background: "/assets/images/6-background.jpg",
      thumbnail: "/assets/images/6-thumbnail.jpg",
      desc: "",
      alt: "Rico in the sun",
      content: (
        <div>
          <h3>SUMMER VIBES&nbsp;ONLY</h3>
          <button>WALK & ROLL</button>
          <h2>RICO'S RECHARGE</h2>
          <p>
            Nothing beats a sunny stroll for this happy pup! Rico's mid-walk breather, 
            complete with closed eyes and a big panting grin, is pure summertime 
            bliss. Leash up and join him for the ultimate doggy day&nbsp;out.
          </p>
          <a
            href="https://www.playstation.com/"
            className="bb-cta"
            target="_blank"
          >
            WALK WITH RICO
          </a>
        </div>
      ),
    },
  ].map((slide) => ({
    ...slide,
    content: CSSVariableInjector.applyChildCSSVariables(slide.content),
  }));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="rico-slideshow/:slug"
          element={
            <Slideshow
              slides={slides}
              basePath="/rico-slideshow"
              initialAutoSlide={false}
            />
          }
        />
        <Route
          path="second-slideshow/:slug"
          element={<Slideshow slides={slides} basePath="/second-slideshow" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
