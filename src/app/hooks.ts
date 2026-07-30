'use client';
import { useEffect, useState } from 'react';

/**
 * SSR-safe `matchMedia` subscription.
 *
 * Always returns `false` on the server and on the first client render, then
 * settles after mount — so the markup React hydrates always matches what the
 * server sent.
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const update = () => setMatches(mql.matches);

		update();
		mql.addEventListener('change', update);
		return () => mql.removeEventListener('change', update);
	}, [query]);

	return matches;
}

/**
 * True only for devices that can actually hover with a precise pointer.
 *
 * This is the correct gate for the custom cursor and any pointer-driven effect.
 * A width check is not: a touch tablet at 1024px would get a frozen blob, and a
 * narrow desktop window would lose the effect entirely.
 */
export function useHoverCapable(): boolean {
	return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/** Viewport-width breakpoint used to pick the drawer vs. the full-screen sheet. */
export function useIsMobileViewport(): boolean {
	return useMediaQuery('(max-width: 768px)');
}

/**
 * Use this rather than framer-motion's `useReducedMotion()`.
 *
 * framer's version reads the media query during the very first client render,
 * so a component that changes its *tree shape* based on it hydrates differently
 * from what the server sent. React reports the mismatch and — critically —
 * refuses to patch the mismatched attributes, which left the server's
 * `opacity: 0` entrance styles stuck on the page: every reduced-motion visitor
 * got a blank `/works`.
 *
 * This one is `false` on the server and on the first client render and settles
 * in an effect, so the swap happens as an ordinary re-render.
 */
export function usePrefersReducedMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}
