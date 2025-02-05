# React Slideshow Component

## Overview

A reusable and multilayered interactive slideshow that supports dynamic routing, auto-slide, and user interactions like navigation, pausing, and restarting. It optionally adjusts its height dynamically based on slide content to avoid overflow or excessive whitespace. It also preloads images.

Slides are defined as an array of objects with background images, thumbnails, and JSX content passed in as props, making the component reusable and flexible.

Dynamic routes (optional). They only stack the history on user interaction, and not on auto-slide.

## Demos

- **Original design (w/ enhancement):**  
  [https://bb-react-slideshow.netlify.app/rico](https://bb-react-slideshow.netlify.app/rico)
- **Stepper button demo:**  
  [https://bb-react-slideshow.netlify.app/demo2](https://bb-react-slideshow.netlify.app/demo2)
- **Index dots (and routing disabled):**  
  [https://bb-react-slideshow.netlify.app/demo3](https://bb-react-slideshow.netlify.app/demo3)
- **Mutliple control sets (thumbnail buttons and stepper):**  
  [https://bb-react-slideshow.netlify.app/demo4](https://bb-react-slideshow.netlify.app/demo4)

## Features

- **Reusable Component:** The slideshow can be integrated into any React application and fits many use cases with the available options.
- **Modular Controls:** Multiple control options are separate components that can be linked or passed to the slideshow component. The slideshow will then use whatever features are provided in each control set. Multiple sets can be used by one slideshow.
- **Dynamic Routing (Optional):** Utilize dynamic routes for deep-linking slides, keeping navigation in sync with the application state.
- **Auto-Slide Functionality:** Automatically transitions between slides, pausing when user interaction is detected. Includes a restart button to re-enable auto-slide.
- **Custom Hooks:** Simplified logic using custom hooks for professional, maintainable code.
- **Configuration Options:** Adjustable settings for auto-slide timing/restart and dynamic routing. Includes two optional sets of controls.
- **Accessibility:** Built with keyboard navigation support and ARIA attributes to ensure an inclusive experience.

## Roadmap

- **Package a Module:** For NPM import.
- **Finish Default Styling:** Overridable default styling should represent a basic slideshow out of the box.
- **Route (replace) Updates for Auto Slide:** I would love route updates on autoslide via `replace` so as to avoid stacking the history. Unfortunately, Chrome has an apparent defect with this that I'm also
  seeing in another project. I may need to investigate and reproduce the issue for a bug report.

## Example

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
    background: `${basePath}/assets/images/1-background.webp`,
    thumbnail: `${basePath}/assets/images/1-thumbnail.webp`,
    alt: "Alt text",
    content: (
      <div>
        <h3>Your HTML content.</h3>
      </div>
    ),
  },
  {
    slug: "two",
    background: `${basePath}/assets/images/2-background.webp`,
    thumbnail: `${basePath}/assets/images/2-thumbnail.webp`,
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
