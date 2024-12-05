# React Slideshow Component

## Overview

The React Slideshow Component is a reusable, scalable, and fluid slideshow designed to enhance modern web experiences. It combines dynamic interactivity with best practices in front-end development to offer a robust and configurable solution for displaying content-rich slideshows.

## Features

- **Reusable Component**: The slideshow is modular and can be seamlessly integrated into any React application.
- **Fluid Scaling**: Designed with responsiveness in mind, the demo adapts fluidly across multiple breakpoints, supporting a minimum width of 320px and scaling up to larger screens.
- **Dynamic Routing (Optional)**: Utilize dynamic routes for deep-linking slides, keeping navigation in sync with the application state.
- **Auto-Slide Functionality**: Automatically transitions between slides, pausing when user interaction is detected. Includes a restart button to re-enable auto-slide.
- **Redux Integration**: Leverages `@lagunovsky/redux-react-router` to synchronize routing and Redux state, ensuring consistent behavior.
- **Custom Hooks**: Simplified logic using custom hooks for professional, maintainable code.
- **Configuration Options**: Adjustable settings for auto-slide timing, slide transition behavior, and dynamic routing.
- **Accessibility**: Built with keyboard navigation support and ARIA attributes to ensure an inclusive experience.

Here is an example JavaScript function:

```javascript
import { Slideshow } from '@bbaysinger/bb-react-slideshow';

const slides = [
  { id: 1, content: (
        <div>
          <h3>Your HTML content.</h3>
        </div>
      ),
 },
  { id: 2, content: (
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
      autoSlideInterval={5000}
      enableDynamicRouting={true}
    />
  );
}
```