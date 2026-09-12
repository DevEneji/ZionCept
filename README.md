# Zion Concept — Premium Architecture Portfolio

A cinematic React/Vite architecture portfolio starter built with:
- React 19
- Vite
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- React Router
- Lucide React
- Responsive CSS
- Reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## Production build

```bash
npm run build
npm run preview
```

## Routes

- `/` — cinematic homepage
- `/work` — project archive
- `/project/:id` — project case study
- `/studio` — studio / philosophy
- `/contact` — enquiry page

## Replacing the placeholder content

Project data is in `src/App.jsx` inside the `projects` array.

Replace:
- project names
- locations
- years
- areas
- descriptions
- Unsplash image URLs
- email
- social links
- studio copy
- statistics

For production, download approved project imagery into `public/images/` and reference local assets instead of remote image URLs.

## Design notes

The animation system deliberately uses restrained motion:
- cinematic hero reveal
- masked typography entrance
- image clip-path reveals
- scroll parallax
- hover image scaling
- animated navigation
- contextual project controls
- responsive mobile composition

The visual direction is intentionally editorial: dark architectural palette, oversized serif display type, restrained sans-serif UI, fine rules and generous negative space.
