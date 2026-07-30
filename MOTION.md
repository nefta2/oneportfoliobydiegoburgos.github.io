# Motion & interaction system

Everything added in the animation pass, and the rules that keep it coherent.
The visual language is unchanged: same palette, same typeface, same layouts.
What is new is **how things move**.

Read alongside the "Design system" and "Adding animation" sections of
[CLAUDE.md](./CLAUDE.md) — those state the constraints, this states what was
built inside them.

---

## 1. The token layer

**`src/app/motion.ts`** is the single source of the site's motion vocabulary.
Nothing should type a raw duration or cubic-bezier inline.

| Token | Value | Use |
|---|---|---|
| `EASE_OUT` | `[0.22, 1, 0.36, 1]` | anything entering or expanding |
| `EASE_IN` | `[0.64, 0, 0.78, 0]` | anything leaving or collapsing |
| `DURATION.fast` | `0.2s` | hover / press feedback |
| `DURATION.base` | `0.45s` | entrances, reveals, drawers |
| `DURATION.exit` | `0.28s` | exits — always shorter than the entrance |
| `DURATION.slow` | `0.7s` | image scale, ken-burns, rule draws |
| `STAGGER` | `0.06s` | delay between siblings in a list |
| `SPRING_POINTER` | `stiffness 500 / damping 30 / mass 0.4` | pointer-following only |
| `VIEWPORT` | `{ once: true, amount: 0.3 }` | standard `whileInView` config |

The two curves are mirrored in `globals.css` as `--ease-editorial` and
`--ease-editorial-in`, exposed by Tailwind as `ease-editorial` /
`ease-editorial-in`, so CSS hovers and framer-motion entrances share one feel.
**Change one, change both.**

`riseVariants` + `staggerParent()` are the house entrance (rise 24px + fade).
Every list on the site uses them, so the gallery grid, the drawer body, the
timeline and the mobile menu all enter identically.

## 2. New reusable pieces

| File | What it is |
|---|---|
| `src/app/hooks.ts` | `useMediaQuery`, `useHoverCapable`, `useIsMobileViewport`, `usePrefersReducedMotion` — all SSR-safe |
| `src/app/components/reveal.tsx` | `<Reveal>` / `<RevealItem>` scroll-reveal wrappers. `as="ul" \| "li"` when wrapping a real list |
| `src/app/components/page-header.tsx` | `<PageHeader>` + `<SectionHeading>` — the shared opening for every page except `/` |
| `src/app/template.tsx` | route-transition wrapper |
| `.text-roll` (in `globals.css`) | the two-layer label swap used by nav, home tiles and contact links |
| `.hairline-draw` / `.hairline-draw-vertical` | rules that draw themselves in, staggered by `--hairline-delay` |

`Reveal` exists so `/about`, `/works` and `/contact-me` can keep their page
shells as **server components** — only the wrapper is `'use client'`.

### `usePrefersReducedMotion`, not framer's `useReducedMotion`

**Always use ours.** framer-motion's version reads the media query during the
first client render, so a component that changes its *tree shape* based on it
hydrates differently from what the server sent. React reports the mismatch and
refuses to patch the mismatched attributes — which left the server's
`opacity: 0` entrance styles stuck in place and rendered `/works` completely
blank for every reduced-motion visitor. Ours is `false` on the server and the
first client render, then settles in an effect.

## 3. What each surface does now

### `/` — home

- **Cursor rewritten onto motion values.** `mousemove` no longer calls
  `setState`; the blob is driven by `useMotionValue` → `useSpring` and the page
  does not re-render while the pointer moves. It also *scales* (1 → 3.125 →
  6.25) instead of animating `width`/`height`.
- Gated on `matchMedia('(hover: hover) and (pointer: fine)')`, so a touch tablet
  no longer gets a frozen blob and a narrow desktop window keeps the effect.
  `cursor-none` is applied only when the blob is actually rendered.
- The blob starts hidden and snaps to the pointer on first sighting instead of
  parking at `0,0`.
- Press feedback is a global `mousedown`/`mouseup` scale-down. (The old handlers
  were on the blob itself, which is `pointer-events: none`, so they never fired.)
- **Tile hover:** the label rolls to a second copy of itself, a `↗` slides in,
  and the revealed photo settles from a slight over-scale.
- **Tile rules draw themselves in** on first paint, staggered 100ms.
- The hero `h1` is deliberately **not** animated on load — first paint stays
  immediate, per the design rules.

### Navigation

- Links use the text roll; the underline wipes in from the left on
  `transform` (it used to animate `width`, which relayouts every frame).
- The active page keeps its rule drawn.
- The mobile overlay is wrapped in `AnimatePresence`, so it now **exits**
  instead of vanishing. Links rise out of a mask, staggered.
- Escape closes it, body scroll locks while open, and `aria-expanded` is set.

### `/works`

- Opens with `PageHeader`.
- The grid staggers its cards in on scroll. **This is the one list not collapsed
  into hairline rows** — on a works page the screenshots are the content. The
  cards carry the `(01)` index motif instead.
- Cards are real `<button>`s (keyboard reachable), the photo scales on hover,
  a `(01)` index appears, and the title rises out of a mask with the
  description and tags following 80ms apart.
- **The drawer and the mobile sheet now animate out** via `AnimatePresence` —
  this was the highest-value motion fix available. The `setTimeout`-driven
  `hasEntered` flag is gone.
- The mobile sheet is portalled like the desktop drawer, so no ancestor
  transform can turn its `position: fixed` into `absolute`.
- Drawer contents stagger in behind the panel slide.

### `/about`

- Opens with `PageHeader`, like every page but `/`.
- **The timeline is now hairline index rows**, not a left rule with dots — the
  same band layout as the contact channels, so the two pages present their lists
  identically. No hover wipe here: these entries are not links, and a hover state
  on something you cannot click is a lie.
- Rows stagger in on scroll.
- The portrait scales gently on hover inside a clipped, rounded frame, and is
  `lg:items-center` against the bio — top-aligning left a large void under the
  button.

### `/contact-me`

Rebuilt as an editorial index list — the three centred logo cards are gone. It
set the pattern the other two pages now follow.

- An oversized `gradient-text` statement carries the page; the `h1` keeps
  "(Contact me)" as an eyebrow above it so the heading still names the subject.
  This is `PageHeader`, shared with `/about` and `/works`.
- Each channel is a **full-bleed hairline row**. On hover a white fill wipes in
  from the left (out to the right on leave, the nav underline's gesture at row
  scale) and the whole row inverts to `#1d1d1d`.
- The `(01)` index **rolls over to a `↗`**, and the label rolls to a second copy
  of itself — the same two-layer swap used everywhere else.
- The logos are white PNGs, so they carry `mix-blend-difference` and flip to
  black as the fill passes under them. `isolate` on the row keeps the blend
  contained, so at rest they still read white against the page.
- All of it is CSS `group-hover`, so the page stays a **server component** —
  only the `Reveal` wrappers are `'use client'`.

### Buttons

`WhiteButton`'s fill wipes up from the bottom on hover and the label inverts to
the page ground. No new colour — the existing white-on-`#1d1d1d` contrast,
swapped.

## 4. Accessibility

- **`prefers-reduced-motion` is now honoured everywhere**, which it previously
  was not anywhere. Two layers: a global CSS block in `globals.css` collapses
  every animation and transition, and each framer-motion component checks
  `usePrefersReducedMotion()` so it never starts a transition at all.
- All hover reveals have `:focus-visible` equivalents.
- Focus rings on the tiles, gallery cards, drawer close and contact links.

## 5. The page shell

Every page except `/` is built from the same four parts, in order:

1. `(EYEBROW)` — small, uppercase, `tracking-[0.3em]`, `#898989`, in parens.
2. An oversized uppercase `gradient-text` statement — the `h1`.
3. A muted intro paragraph, `max-w-[520px]`.
4. Hairline index rows: `border-t-[0.5px]`, an `(01)` index, an uppercase label,
   right-aligned meta.

Parts 1–3 are `PageHeader`, so they cannot drift apart. Part 4 is the contact
channels and both `/about` lists; `/works` substitutes its image grid.

Rows that are **links** additionally get the white fill wipe plus
`mix-blend-difference`. Rows that are not links get neither.

## 6. New design decisions to be aware of

These are additions, not changes to the existing language — listed so they are a
deliberate choice rather than a surprise:

- **`↗` on home-tile hover** and **`(01)`/`(02)` indices on gallery cards.**
  Both extend the existing parenthetical `(I) (II) (III)` numbering motif.
- **The text roll** as the site-wide hover gesture.
- **`::selection`** inverts to `#ededed` on `#1d1d1d`, and scrollbars are
  restyled to `#454545` on transparent. Both use existing palette values.
- **`html { scroll-behavior: smooth }`**, disabled under reduced motion.
- **Route transitions** — a 450ms rise-and-fade on client-side navigation only.
  The first paint of a session is never gated, and `/` is never wrapped (it owns
  the viewport and a `position: fixed` cursor).
- `--surface` (`#454545`) and `--muted` (`#898989`) are now real CSS variables
  and Tailwind colours (`surface`, `muted`) rather than hex literals scattered
  through components. Same values as before.

## 7. Two rendering traps worth remembering

- **Sub-pixel rules must be borders, not backgrounds.** Chromium snaps a
  `0.5px`-tall background box away to nothing but clamps a `0.5px` border to a
  visible hairline. The home tile rules are `border-b-[0.5px]` spans for exactly
  this reason.
- **Unlayered CSS outranks every Tailwind utility.** `globals.css` is not in a
  `@layer`, so a rule like `.about-image > * { position: relative }` silently
  beats an `absolute` set in markup — it flattened the tile hairlines into the
  flex row. That rule now sets `z-index` only.
