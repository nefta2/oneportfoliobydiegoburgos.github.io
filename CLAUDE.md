# CLAUDE.md

Personal portfolio of Diego Burgos ("One Portfolio by Diego Burgos" / `1DB`). Next.js 15 App Router + React 19 + Tailwind v4 + Framer Motion, deployed from `main` to `github.com/nefta2/oneportfoliobydiegoburgos.github.io`.

## Commands

```bash
npm run dev              # next dev on :3000
npm run build            # production build — run before declaring UI work done
npm run lint             # next lint (eslint 9 flat config + storybook plugin)
npx tsc --noEmit         # typecheck
npm run storybook        # Storybook 10 on :6006 (@storybook/nextjs-vite)
npx vitest --project storybook   # story smoke tests in headless chromium (playwright)
```

Repo root is `portfolio-2025/`; the parent `Portfolio 2025/` folder is not the project.

## Architecture

Everything lives under `src/app/`. Four routes, all statically renderable:

| Route | File | Server/Client |
|---|---|---|
| `/` | `src/app/page.tsx` | client — custom cursor + three hover-reveal tiles |
| `/about` | `src/app/about/page.tsx` | server — bio, `Timeline` for experience + tech stacks |
| `/works` | `src/app/works/page.tsx` | server — project data array → `Gallery` |
| `/contact-me` | `src/app/contact-me/page.tsx` | server — social links |

`src/app/layout.tsx` mounts `NavigationBar` globally; the nav hides itself on `/` (`pathname === '/'` → `hidden`).

Components in `src/app/components/`:

- `navigation-bar.tsx` + `.css` — desktop links with an underline-grow hover; mobile burger → full-screen overlay with staggered `dropdown-link` entrance (`animationDelay: index * 0.2s`).
- `gallery.tsx` → `gallery-item.tsx` — 2-col grid of project cards. `@floating-ui/react` (`useClick`/`useRole`/`useDismiss` + `FloatingPortal`/`FloatingOverlay`/`FloatingFocusManager`) drives a **right-side drawer on desktop** and a separate **full-screen sheet on mobile** (`isMobile = innerWidth <= 768`). Enter animation is a `hasEntered` boolean flipped in a 10ms `setTimeout`.
- `side-info-bar.tsx` — drawer body; on mobile adds touch handlers for swipe-down-to-close.
- `timeline.tsx`, `tags-group.tsx`, `white-button.tsx` — small presentational pieces.

Content is hardcoded inline in the page files (no CMS, no data layer). Adding a project = appending to the `works` array in `src/app/works/page.tsx` plus an image in `public/`.

Storybook covers only `white-button` and `navigation-bar`. `src/stories/` is untouched CRA-style scaffolding — ignore it, don't build on it.

## Design system — do not change the style

The visual language is deliberate: **monochrome, editorial, high-contrast, lots of negative space**. Preserve it. Enhancements must be motion, polish, and micro-interaction — never a new palette, new typeface, or new layout paradigm.

- **Palette:** background `#1d1d1d`, foreground `#ededed`, tag chips `#454545`, muted links `#898989`, pure-white hairlines. Gradient text ramps `#fefefe → #6a6a6a → #2e2e2e`. There is no accent color, and adding one is a style change — don't.
- **Type:** Space Grotesk (weight `300` for page content, `400` for nav and drawer), loaded per-file via `next/font/google`. Geist/Geist Mono CSS vars are set in the layout but pages override them.
- **Signature motifs:** oversized uppercase hero type with wide `tracking-*` that scales by breakpoint; the animated silver `gradient-text` (`animate-gradient`, 10s linear, defined in `globals.css`); `0.5px` white hairline dividers; decorative SVG (`meteor.svg`, `simple_shiny.svg`, `sprinkle.svg`) that cross-fades to a photo on hover; `rounded-lg` cards; pill tags; the white `mix-blend-difference` cursor that grows over text.
- **Motion vocabulary today:** 300–500ms `ease-out` on opacity/transform, springs for the cursor, staggered fades for the mobile menu. Anything new should read as part of this family.

### Adding animation (the main ongoing goal)

1. **Animate `transform` and `opacity` only.** Never animate `width`/`height`/`top`/`left`/`filter` on scroll- or pointer-driven interactions.
2. **Timing:** 150–250ms for hover/press feedback, 300–500ms for entrances and drawers. `ease-out` entering, `ease-in` leaving. Springs (`stiffness` 300–500, `damping` 25–30) for pointer-following only.
3. **Stagger** list children 40–80ms — the existing 200ms nav stagger is at the upper limit; don't go slower.
4. **Always gate on `prefers-reduced-motion`.** No current component does this, which is a real a11y gap — new motion must respect it (`useReducedMotion()` from framer-motion, or a `@media (prefers-reduced-motion: reduce)` block in `globals.css`).
5. **Scroll reveals** belong on `/about` and `/works` (the two long pages): `whileInView` with `viewport={{ once: true, amount: 0.3 }}`. The hero on `/` should stay immediate — no fade-in gate on the first paint.
6. **Prefer framer-motion's declarative API** (`variants`, `whileHover`, `whileTap`, `layoutId`, `AnimatePresence`) over imperative `animate()` calls and `setTimeout`-driven boolean flags.
7. **Exit animations require `AnimatePresence`.** The drawer, mobile sheet, and mobile menu all currently unmount instantly — wrapping them is the highest-value motion fix available.
8. Keep the total motion budget low. This is a portfolio for recruiters and clients: it should feel expensive and calm, not busy.

## SEO

`src/app/site.ts` is the single source of truth for the absolute origin and identity strings. Change the domain there and `metadataBase`, canonicals, `sitemap.xml`, `robots.txt` and the JSON-LD all follow.

- `src/app/layout.tsx` holds `metadataBase`, the title template, OG/Twitter defaults, and a `Person` JSON-LD block linking the site to the GitHub/LinkedIn profiles.
- **`/` is a client component and cannot export `metadata`.** Its title comes from `title.default` in the layout — edit it there, not in `page.tsx`. Child routes get `%s — Diego Burgos` via `title.template`.
- `src/app/sitemap.ts` and `src/app/robots.ts` are Next file conventions; add new routes to the sitemap array manually.
- `src/app/opengraph-image.tsx` generates the 1200×630 share card at build time via `next/og`. It deliberately avoids a custom font (no build-time network fetch) and reproduces the brand with color, scale and tracking instead.
- Headings are load-bearing for search: one `<h1>` per page, and it should contain the page's subject. Tailwind preflight resets heading font-size/weight to `inherit`, so **changing a heading level is visually a no-op** — pick the tag for meaning, size with a class.

## Conventions

- Tabs for indentation, single quotes, semicolons.
- `'use client'` only where hooks/interactivity are needed; keep `/about`, `/works`, `/contact-me` page shells as server components.
- Tailwind v4 — config lives in `@theme` blocks in `src/app/globals.css`, **not** a `tailwind.config.js`. Custom breakpoints: `xs` (26rem) and `3xl` (101rem).
- Component-scoped CSS is imported directly (`import './navigation-bar.css'`) for pseudo-element effects Tailwind can't express.
- Path alias `@/*` → `./src/*` exists but is unused; relative imports are the norm.
- `next/image` for photos; raw `<img>`/CSS `background-image` for decorative SVGs.

## Known issues (fix opportunistically when touching the file)

- `src/app/page.tsx` — every `mousemove` calls `setMousePosition`, re-rendering the entire homepage. Should use `useMotionValue`/`useSpring` so the cursor animates off the React render path. This is the single biggest perf win on the site.
- `src/app/page.tsx` — the cursor's `isMobile` test uses `window.innerWidth <= 768`, but it means to test *hover capability*. A touch tablet at 1024px gets a frozen blob; a desktop window under 768px loses the effect. Use `matchMedia('(hover: hover) and (pointer: fine)')`. `cursor-none` is also applied unconditionally, so wherever the blob is suppressed the native cursor is hidden with nothing replacing it.
- `src/app/page.tsx` — `mousePosition` starts at `{0, 0}`, so the cursor is parked in the top-left corner until the first mouse move.
- `src/app/page.tsx:47` — `transition: { type: 'linear' }` is not a valid framer-motion type; should be `{ type: 'tween', ease: 'linear' }`.
- `src/app/components/white-button.tsx:30` — `px-[${horizontalPadding}px]` can't work: Tailwind cannot see runtime-interpolated class names. The class is also `px-` twice (the second should be `py-`), and `verticalPadding` is dead. Use inline `style` or fixed variants.
- `src/app/components/navigation-bar.tsx:64` — `bg-opacity-90` is Tailwind v3 syntax removed in v4; use `bg-black/90`.
- `src/app/components/gallery-item.tsx:110,132` — `translate-x-100` / `translate-y-100` resolve to 25rem on the v4 spacing scale, not 100%. Likely meant `translate-x-full` / `translate-y-full`.
- Root-level `page.tsx` is a 0-byte stray file, outside `src/`. Safe to delete.
- `globals.css` defines light-mode vars and a `prefers-color-scheme: dark` block, but `body` hardcodes the dark values — the light theme is unreachable. Either wire it up or drop the dead vars; don't half-fix it.
- `src/stories/` is generated Storybook demo scaffolding whose lint errors fail `next build`; it's excluded in `eslint.config.mjs`. Deleting the directory outright would also be fine.
