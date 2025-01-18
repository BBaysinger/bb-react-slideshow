import { SlideType } from "./Slideshow.types";

const Overlay: React.FC<{
  slides: SlideType[];
  currentIndex: number;
  classPrefix: string;
}> = ({ slides, currentIndex, classPrefix }) => (
  <div className={`${classPrefix}overlay-wrapper`}>
    {slides.map((_, index) => (
      <div
        key={index}
        className={`${classPrefix}overlay ${index === currentIndex ? `${classPrefix}active` : ""}`}
      ></div>
    ))}
  </div>
);

export default Overlay;
