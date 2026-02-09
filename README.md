# bb-react-slideshow

A React + TypeScript slideshow component (with a demo app) built on Vite.

The core `Slideshow` component supports:

- Auto-slide (`none` | `initial` | `persistent`)
- Optional route-driven slide selection (React Router)
- Pluggable control sets (thumbnails/dots, steppers, custom controls)
- Keyboard navigation (left/right arrows)
- Image prefetching

This repo currently ships as a demo app, with the component living in `src/slideshow`.

## Live demos

- Original design (with enhancement): https://bb-react-slideshow.netlify.app/rico
- Stepper buttons: https://bb-react-slideshow.netlify.app/demo2
- Index dots + routing disabled (no route updates on navigation): https://bb-react-slideshow.netlify.app/demo3
- Multiple control sets (thumbnails + stepper): https://bb-react-slideshow.netlify.app/demo4

## Quick start

Prereqs (per `package.json`):

- Node `>= 23.4.0`
- npm `>= 11.0.0`

Install + run:

```bash
npm install
npm run dev
```

Build + preview:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: typecheck (project build) + production build
- `npm run preview`: serve the production build locally
- `npm run lint`: run ESLint
- `npm run format`: run Prettier
- `npm run pb`: format + typecheck + build

## Environment / base paths

Vite’s `base` is configured from env vars in [vite.config.ts](vite.config.ts):

- `VITE_DEV_BASE_URL`
- `VITE_PROD_BASE_URL`

They’re also used by the demo app (see [src/App.tsx](src/App.tsx)) to build asset URLs and route prefixes.

Defaults live in [.env](.env):

```dotenv
VITE_DEV_BASE_URL=""
VITE_PROD_BASE_URL=""
```

Notes:

- For deployment at domain root, keep them empty.
- For deployment under a subpath, set them to that subpath (commonly `"/my-subdir"`).
- If you use a subpath, ensure your host is configured to serve `index.html` for SPA routes (Netlify does this via [public/\_redirects](public/_redirects)).

## Component usage

### `Slideshow` props

The public types live in [src/slideshow/Slideshow.types.tsx](src/slideshow/Slideshow.types.tsx).

Key props:

- `slides` (required): array of `SlideType`
- `classPrefix` (required): string prefix applied to globally-scoped classnames (helps avoid collisions)
- `autoSlideMode`: `"none" | "initial" | "persistent"` (default: `"persistent"`)
- `interval`: ms between slides (default: `6000`)
- `restartDelay`: ms to delay auto-slide after user navigation (default: `12000`)
- `enableRouting`: if `true`, user navigation updates the route via `navigate(...)` (default: `true`)
- `basePath`: route prefix used when `enableRouting` is on (default: `"/slideshow"`)
- `controls`: array of control components implementing `SlideshowControlType`
- `debug`: show the debug overlay

### `SlideType`

Each slide is:

- `slug` (required): used for routing / identification
- `background` (required): background image URL
- `thumbnail` (optional): thumbnail image URL (used by indexed controls)
- `foreground` (optional): foreground image URL (if used by your styling)
- `alt`, `desc`, `title` (optional): metadata
- `content` (optional): JSX content shown in the slide

### Controls API

Controls are React components you pass via the `controls` prop. Each control receives callbacks and state like:

- `onPrev`, `onNext`: navigate between slides
- `onIndex(index)`: jump to a slide by index
- `onTogglePause`: pause/resume (the built-in behavior advances 1 slide when resuming)
- `currentIndex`, `isPaused`, `slides`, `classPrefix`, `labels`

Examples in this repo:

- Indexed (thumbnails/dots): [src/slideshow/components/CustomIndexedControls.tsx](src/slideshow/components/CustomIndexedControls.tsx)
- Stepper buttons: [src/slideshow/components/CustomStepperControls.tsx](src/slideshow/components/CustomStepperControls.tsx)
  - Includes a helper factory: `createStepperControls(customLabels)`

### Routing behavior (important)

- When a `:slug` route param is present, the slideshow will select the matching slide.
- When `enableRouting` is `true`, user navigation updates the URL (pushes history).
- Auto-slide intentionally does **not** update the URL (so it doesn’t spam browser history).
- When `enableRouting` is `false`, the component won’t navigate on user interaction (but it can still read an existing `:slug` on mount).

## Demo app structure

- Demo routes and slideshow configurations: [src/App.tsx](src/App.tsx)
- `Slideshow` component: [src/slideshow/Slideshow.tsx](src/slideshow/Slideshow.tsx)
- Styling: SCSS Modules under `src/slideshow/components/*.module.scss` and globals in `src/scss`
- Utilities:
  - CSS variable injection for staggered animations: [src/utils/CSSVariableInjector.ts](src/utils/CSSVariableInjector.ts)
  - Sequential image prefetching: [src/utils/ImagePreloader.ts](src/utils/ImagePreloader.ts)

## Roadmap

- Package as an npm module (export `Slideshow` + types cleanly)
- Provide default theme styling that’s easy to override
- Investigate route updates on autoslide via `replace` (to avoid stacking history)
