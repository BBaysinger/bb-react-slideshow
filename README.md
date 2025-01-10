# React Slideshow Component

## Overview

The React Slideshow Component is a reusable, scalable, and fluid slideshow designed to enhance modern web experiences. It combines dynamic interactivity with best practices in front-end development to offer a robust and configurable solution for displaying content-rich slideshows.

## Demos

- Original design (w/ one notable change):
 [https://bb-react-slideshow.netlify.app/rico-slideshow](https://bb-react-slideshow.netlify.app/rico-slideshow)
- Stepper button demo:
 [https://bb-react-slideshow.netlify.app/config-example-2](https://bb-react-slideshow.netlify.app/config-example-2)
- Index dots:
 [https://bb-react-slideshow.netlify.app/config-example-3](https://bb-react-slideshow.netlify.app/config-example-3)

## Features

- **Reusable Component**: The slideshow can be integrated into any React application and fits many use cases with the options available.
- **Dynamic Routing (Optional)**: Utilize dynamic routes for deep-linking slides, keeping navigation in sync with the application state.
- **Auto-Slide Functionality**: Automatically transitions between slides, pausing when user interaction is detected. Includes a restart button to re-enable auto-slide.
- **Custom Hooks**: Simplified logic using custom hooks for professional, maintainable code.
- **Configuration Options**: Adjustable settings for auto-slide timing/restart and dynamic routing. Two optional sets of controls.
- **Accessibility**: Built with keyboard navigation support and ARIA attributes to ensure an inclusive experience.

Here is an example JavaScript function:

```javascript
import { Slideshow } from "@bbaysinger/bb-react-slideshow";

const basePath =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_BASE_URL
    : import.meta.env.VITE_DEV_BASE_URL;

const slides = [
  {
    slug: "one",
    background: `${basePath}/assets/images/1-background.jpg`,
    thumbnail: `${basePath}/assets/images/1-thumbnail.jpg`,
    alt: "Alt text",
    content: (
      <div>
        <h3>Your HTML content.</h3>
      </div>
    ),
  },
  {
    slug: "two",
    background: `${basePath}/assets/images/2-background.jpg`,
    thumbnail: `${basePath}/assets/images/2-thumbnail.jpg`,
    alt: "More alt text",
    content: (
      <div>
        <h3>More HTML content.</h3>
      </div>
    ),
  },
];

export default function App() {
  return (
    <Slideshow
      slides={slides}
      interval={5000}
      basePath={`${basePath}/slideshow`}
      enableRouting={true}
    />
  );
}
```
