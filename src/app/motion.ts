/**
 * Shared motion vocabulary.
 *
 * The whole site should feel like one hand animated it, so every duration,
 * curve and stagger used by a component comes from here instead of being typed
 * inline. The values encode the rules in CLAUDE.md → "Adding animation":
 * transform/opacity only, 150–250ms for feedback, 300–500ms for entrances,
 * 40–80ms staggers.
 *
 * Mirrors of the two curves exist in `globals.css` as `--ease-editorial` /
 * `--ease-editorial-in` so CSS-driven hovers match the JS-driven ones. Change
 * one, change both.
 */

/** Decelerating curve for anything entering or expanding. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Accelerating curve for anything leaving or collapsing. */
export const EASE_IN: [number, number, number, number] = [0.64, 0, 0.78, 0];

export const DURATION = {
	/** Hover / press feedback. */
	fast: 0.2,
	/** Entrances, reveals, drawers. */
	base: 0.45,
	/** Exits — always shorter than the entrance so dismissals feel snappy. */
	exit: 0.28,
	/** Slow settles: image scale, ken-burns, hairline draws. */
	slow: 0.7,
} as const;

/** Delay between siblings in a staggered list. */
export const STAGGER = 0.06;

/** Pointer-following springs. Never use these for layout-driven motion. */
export const SPRING_POINTER = {
	type: 'spring',
	stiffness: 500,
	damping: 30,
	mass: 0.4,
} as const;

/**
 * The house entrance: rise + fade. Used by `Reveal`, the gallery grid, the
 * drawer body and the mobile menu so every list on the site enters identically.
 */
export const riseVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: DURATION.base, ease: EASE_OUT },
	},
};

/** Parent for `riseVariants` children. */
export const staggerParent = (stagger: number = STAGGER, delay: number = 0) => ({
	hidden: {},
	visible: {
		transition: { staggerChildren: stagger, delayChildren: delay },
	},
});

/** Standard `whileInView` config — reveal once, when a third of the block shows. */
export const VIEWPORT = { once: true, amount: 0.3 } as const;
