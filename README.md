# bb-react-slideshow

A **reusable React slideshow component** with a demo app, built with **React, TypeScript, and Vite**.

This project started as an early deeper exercise in **React hooks, composable state, and interactive UI behavior**, and grew into a flexible slideshow system designed to support a range of presentation styles, control patterns, and content structures without changing its core logic.

The component currently lives in `src/slideshow`, while this repo ships as a demo app showing different configurations and behaviors.

## What it supports

- **Auto-slide modes**: `none`, `initial`, `persistent`
- **Optional route-driven slide selection** with React Router
- **Pluggable control sets** such as thumbnails, dots, steppers, and custom controls
- **Keyboard navigation** with left/right arrow support
- **Image prefetching**
- **Configurable slide data** for backgrounds, thumbnails, foreground imagery, metadata, and JSX content
- **Multiple demo configurations** showing different navigation and routing setups

## Live demos

- **Original design (with enhancement):** https://bb-react-slideshow.netlify.app/rico
- **Stepper buttons:** https://bb-react-slideshow.netlify.app/demo2
- **Index dots + routing disabled:** https://bb-react-slideshow.netlify.app/demo3
- **Multiple control sets (thumbnails + stepper):** https://bb-react-slideshow.netlify.app/demo4

## Why I built it

Rather than building a one-off carousel for a single screen, I wanted to explore how a richer slideshow component could be structured for **reuse, flexibility, and maintainability**. A big part of the project was learning how to organize **stateful interactive behavior** with hooks, while keeping routing, timed transitions, controls, and media handling modular enough to support different use cases.

## Quick start

### Requirements

Per `package.json`:

- Node `>= 23.4.0`
- npm `>= 11.0.0`

### Install and run

```bash
npm install
npm run dev
```

### Build and preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — typecheck and create a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run format` — run Prettier
- `npm run pb` — format, typecheck, and build

## Environment and base paths

Vite's `base` is configured through environment variables in [`vite.config.ts`](vite.config.ts):

- `VITE_DEV_BASE_URL`
- `VITE_PROD_BASE_URL`

These are also used by the demo app in [`src/App.tsx`](src/App.tsx) to build asset URLs and route prefixes.

Defaults live in [`.env`](.env):

```dotenv
VITE_DEV_BASE_URL=""
VITE_PROD_BASE_URL=""
```

### Notes

- For deployment at the domain root, leave both values empty.
- For deployment under a subpath, set them to that subpath, commonly `"/my-subdir"`.
- If using a subpath, make sure your host is configured to serve `index.html` for SPA routes. Netlify is configured for this via [`public/_redirects`](public/_redirects).

## Component usage

### `Slideshow` props

The public types live in [`src/slideshow/Slideshow.types.tsx`](src/slideshow/Slideshow.types.tsx).

Key props include:

- `slides` *(required)* — array of `SlideType`
- `classPrefix` *(required)* — string prefix applied to globally scoped class names to help avoid collisions
- `autoSlideMode` — `"none" | "initial" | "persistent"` *(default: `"persistent"`)*
- `interval` — milliseconds between slides *(default: `6000`)*
- `restartDelay` — delay before auto-slide resumes after user navigation *(default: `12000`)*
- `enableRouting` — when `true`, user navigation updates the route *(default: `true`)*
- `basePath` — route prefix used when `enableRouting` is on *(default: `"/slideshow"`)*
- `controls` — array of control components implementing `SlideshowControlType`
- `debug` — enables the debug overlay

### `SlideType`

Each slide supports:

- `slug` *(required)* — used for routing and identification
- `background` *(required)* — background image URL
- `thumbnail` *(optional)* — thumbnail image URL for indexed controls
- `foreground` *(optional)* — foreground image URL
- `alt`, `desc`, `title` *(optional)* — metadata
- `content` *(optional)* — JSX content rendered in the slide

### Controls API

Controls are React components passed through the `controls` prop. Each control receives slideshow state and navigation callbacks such as:

- `onPrev`, `onNext`
- `onIndex(index)`
- `onTogglePause`
- `currentIndex`
- `isPaused`
- `slides`
- `classPrefix`
- `labels`

Examples in this repo:

- Indexed controls (thumbnails/dots): [`src/slideshow/components/CustomIndexedControls.tsx`](src/slideshow/components/CustomIndexedControls.tsx)
- Stepper controls: [`src/slideshow/components/CustomStepperControls.tsx`](src/slideshow/components/CustomStepperControls.tsx)
  - Includes a helper factory: `createStepperControls(customLabels)`

## Routing behavior

- When a `:slug` route param is present, the slideshow selects the matching slide.
- When `enableRouting` is `true`, user navigation updates the URL and pushes history.
- Auto-slide intentionally does **not** update the URL, so browser history does not get spammed during timed transitions.
- When `enableRouting` is `false`, the component will not navigate on user interaction, but it can still read an existing `:slug` on mount.

## Demo app structure

- Demo routes and slideshow configurations: [`src/App.tsx`](src/App.tsx)
- Core component: [`src/slideshow/Slideshow.tsx`](src/slideshow/Slideshow.tsx)
- Styling: SCSS Modules under `src/slideshow/components/*.module.scss` and globals in `src/scss`
- Utilities:
  - CSS variable injection for staggered animations: [`src/utils/CSSVariableInjector.ts`](src/utils/CSSVariableInjector.ts)
  - Sequential image prefetching: [`src/utils/ImagePreloader.ts`](src/utils/ImagePreloader.ts)

## Project direction

This repo currently presents the slideshow as a **working demo app plus reusable component code**, rather than as a fully packaged library. The larger goal was to build something flexible enough to serve as a reusable slideshow solution across different presentation needs, while learning more disciplined patterns for managing interactive component behavior with hooks.

## Roadmap

- Package the component as an npm module with cleaner public exports
- Provide a default theme layer that is easy to override
- Explore auto-slide route updates via `replace` to avoid stacking browser history
