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
| `/about` | `src/app/about/page.tsx` | server — bio + portrait, `Timeline` rows for experience + tech stacks |
| `/works` | `src/app/works/page.tsx` | server — project data array → `Gallery` |
| `/contact-me` | `src/app/contact-me/page.tsx` | server — oversized statement + three full-bleed channel rows |

`src/app/layout.tsx` mounts `NavigationBar` globally; the nav hides itself on `/` (`pathname === '/'` → `hidden`).

`src/app/template.tsx` wraps every route in a rise-and-fade transition on client-side navigation. It deliberately skips the first paint of a session (module-level `hasNavigated` latch) and skips `/` entirely.

Components in `src/app/components/`:

- `navigation-bar.tsx` + `.css` — desktop links with a text roll on hover and a `transform`-based underline wipe; mobile burger → full-screen overlay wrapped in `AnimatePresence`, links rising out of a mask.
- `gallery.tsx` → `gallery-item.tsx` — 2-col grid of project cards, staggered in on scroll. `@floating-ui/react` (`useClick`/`useRole`/`useDismiss` + `FloatingPortal`/`FloatingFocusManager`) drives a **right-side drawer on desktop** and a separate **full-screen sheet on mobile** (`useIsMobileViewport()`); both are portalled and both enter *and exit* via `AnimatePresence`. The card itself is a `<button>`, so its subtree is `span`s only (phrasing content).
- `side-info-bar.tsx` — drawer body, staggered; on mobile adds touch handlers for swipe-down-to-close.
- `page-header.tsx` — `<PageHeader>` (eyebrow → oversized statement → optional intro) and `<SectionHeading>`. **Every page except `/` opens with `PageHeader`.** Adding a route means using it, not hand-rolling a heading.
- `reveal.tsx` — `<Reveal>` / `<RevealItem>` scroll-reveal wrappers, with `as="ul" | "li"` for real lists. **Use these to animate a server-component page** instead of converting the page to a client component.
- `timeline.tsx` — the hairline index rows on `/about` (experience + tech stacks). Same band layout as the contact channels, without the hover wipe, because the entries are not links.
- `tags-group.tsx`, `white-button.tsx` — small presentational pieces.

Shared, non-component modules:

- `src/app/motion.ts` — every duration, curve, stagger and spring on the site. Never type these inline.
- `src/app/hooks.ts` — `useMediaQuery`, `useHoverCapable`, `useIsMobileViewport`, `usePrefersReducedMotion`. All SSR-safe.

**`MOTION.md` documents the motion system and what each surface does.** Read it before touching animation.

Content is hardcoded inline in the page files (no CMS, no data layer). Adding a project = appending to the `works` array in `src/app/works/page.tsx` plus an image in `public/`.

Storybook covers only `white-button` and `navigation-bar`. `src/stories/` is untouched CRA-style scaffolding — ignore it, don't build on it.

## Design system — do not change the style

The visual language is deliberate: **monochrome, editorial, high-contrast, lots of negative space**. Preserve it. Enhancements must be motion, polish, and micro-interaction — never a new palette, new typeface, or new layout paradigm.

- **Palette:** background `#1d1d1d`, foreground `#ededed`, tag chips `#454545`, muted links `#898989`, pure-white hairlines. Gradient text ramps `#fefefe → #6a6a6a → #2e2e2e`. There is no accent color, and adding one is a style change — don't.
- **Type:** Space Grotesk (weight `300` for page content, `400` for nav and drawer), loaded per-file via `next/font/google`. Geist/Geist Mono CSS vars are set in the layout but pages override them.
- **Signature motifs:** oversized uppercase hero type with wide `tracking-*` that scales by breakpoint; the animated silver `gradient-text` (`animate-gradient`, 10s linear, defined in `globals.css`); `0.5px` white hairline dividers; decorative SVG (`meteor.svg`, `simple_shiny.svg`, `sprinkle.svg`) that cross-fades to a photo on hover; `rounded-lg` cards; pill tags; the white `mix-blend-difference` cursor that grows over text.
- **Motion vocabulary today:** defined by `src/app/motion.ts` — 200ms feedback, 450ms entrances, 280ms exits, 60ms staggers, `--ease-editorial` throughout. The site-wide hover gesture is the **text roll** (`.text-roll`, two stacked label copies swapping in place). See `MOTION.md`.
- **The page shell** (everything except `/`): `(EYEBROW)` in parens → oversized uppercase `gradient-text` statement → muted intro → hairline index rows. `PageHeader` owns the top of it; `border-t-[0.5px]` list rows with `(01)` indices own the bottom. `/works` is the one page that keeps an image grid instead of rows — on a works page the screenshots are the content.
- **Later additions to the motif set** (all monochrome, all extending what was already there): the `↗` on home-tile hover and `(01)`-style gallery indices, both extending the `(I) (II) (III)` numbering; inverted `::selection`; `#454545` scrollbars; hairline rules that draw themselves in.

### Adding animation (the main ongoing goal)

1. **Animate `transform` and `opacity` only.** Never animate `width`/`height`/`top`/`left`/`filter` on scroll- or pointer-driven interactions.
2. **Timing:** 150–250ms for hover/press feedback, 300–500ms for entrances and drawers. `ease-out` entering, `ease-in` leaving. Springs (`stiffness` 300–500, `damping` 25–30) for pointer-following only.
3. **Stagger** list children 40–80ms — the existing 200ms nav stagger is at the upper limit; don't go slower.
4. **Always gate on `prefers-reduced-motion`.** `globals.css` has a global block that collapses every CSS animation and transition; framer-motion components additionally check `usePrefersReducedMotion()` from `src/app/hooks.ts`. **Use ours, never framer-motion's `useReducedMotion()`** — framer's reads the media query during the first client render, so branching a tree on it causes a hydration mismatch that React refuses to patch, and it once left `/works` blank for reduced-motion visitors.
5. **Scroll reveals** belong on `/about` and `/works` (the two long pages): `whileInView` with `viewport={{ once: true, amount: 0.3 }}`. The hero on `/` should stay immediate — no fade-in gate on the first paint.
6. **Prefer framer-motion's declarative API** (`variants`, `whileHover`, `whileTap`, `layoutId`, `AnimatePresence`) over imperative `animate()` calls and `setTimeout`-driven boolean flags.
7. **Exit animations require `AnimatePresence`.** The drawer, mobile sheet and mobile menu are wrapped; keep the direct child of `AnimatePresence` a `motion` component so presence is guaranteed.
8. **Pull values from `src/app/motion.ts`.** A new inline duration or cubic-bezier is a drift in the house feel.
9. Keep the total motion budget low. This is a portfolio for recruiters and clients: it should feel expensive and calm, not busy.

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
- `globals.css` is **unlayered**, so every rule in it outranks every Tailwind utility. Keep its selectors narrow and avoid setting `position` from there.
- Path alias `@/*` → `./src/*` exists but is unused; relative imports are the norm.
- `next/image` for photos; raw `<img>`/CSS `background-image` for decorative SVGs.

## Known issues (fix opportunistically when touching the file)

- Root-level `page.tsx` is a 0-byte stray file, outside `src/`. Safe to delete.
- `src/stories/` is generated Storybook demo scaffolding whose lint errors fail `next build`; it's excluded in `eslint.config.mjs`. Deleting the directory outright would also be fine.
- `gallery-item.tsx` never calls `refs.setFloating`, so `useDismiss`'s outside-press check has no floating element to test against. Left as-is because the current behaviour is what ships; wire the ref if you touch the dismiss logic.
- `framer-motion` is imported everywhere but only present as a transitive dependency of `motion` in `package.json`. Promote it to a direct dependency.

## Rendering traps that have already bitten this repo

- **Sub-pixel rules must be borders, not backgrounds.** Chromium snaps a `0.5px`-tall background box away to nothing but clamps a `0.5px` *border* to a visible hairline. The home tile rules are `border-b-[0.5px]` spans for exactly this reason.
- **`globals.css` is unlayered, so it outranks every Tailwind utility.** A rule like `.about-image > * { position: relative }` silently beats an `absolute` set in markup. Prefer `z-index`-only rules and let markup own positioning.
- **Don't branch a component's tree shape on a media query read during the first render.** See the `usePrefersReducedMotion` note above.
