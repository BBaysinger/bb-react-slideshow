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
      alt: "Slide 1",
      content: (
        <div>
          <h3>MORE FROM RICO THE DOG</h3>
          <button>RICO IS BACK!</button>
          <h2 className="">RICOBOT</h2>
          <p>
            Charge into a brand-new supersized adventure with RICO across 50
            exciting and diverse worlds, available now on PS5!
          </p>
          <a
            href="https://www.playstation.com/"
            className="cta"
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
      alt: "Slide 2",
      content: (
        <div>
          <h3>CAUGHT IN THE ACT…</h3>
          <button>Bashful Bulldog Blues</button>
          <h2 className="">RICOBOT</h2>
          <p>
            Rico may be the king of the couch, but when you walk in on his
            mid-afternoon lounging session, he suddenly pretends he's never seen
            a bed before. His guilty-but-adorable side-eye is unmatched.
          </p>
          <a
            href="https://www.playstation.com/"
            className="cta"
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
      alt: "Slide 3",
      content: (
        <div>
          <div>Slide 3 Content</div>
        </div>
      ),
    },
    {
      slug: "four",
      background: "/assets/images/4-background.jpg",
      thumbnail: "/assets/images/4-thumbnail.jpg",
      desc: "",
      alt: "Slide 4",
      content: (
        <div>
          <div>Slide 4 Content</div>
        </div>
      ),
    },
    {
      slug: "five",
      background: "/assets/images/5-background.jpg",
      thumbnail: "/assets/images/5-thumbnail.jpg",
      desc: "",
      alt: "Slide 5",
      content: (
        <div>
          <div>Slide 5 Content</div>
        </div>
      ),
    },
    {
      slug: "six",
      background: "/assets/images/6-background.jpg",
      thumbnail: "/assets/images/6-thumbnail.jpg",
      desc: "",
      alt: "Slide 6",
      content: (
        <div>
          <div>Slide 6 Content</div>
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
