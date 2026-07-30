'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DURATION, EASE_OUT } from './motion';
import { usePrefersReducedMotion } from './hooks';

/**
 * Next remounts `template.tsx` on every navigation (unlike `layout.tsx`), which
 * makes it the natural place for a route transition: each new page mounts with
 * a short rise-and-fade so moving between routes reads as one continuous
 * surface instead of a hard cut.
 *
 * The children are still whatever the route exports — `/about`, `/works` and
 * `/contact-me` stay server components.
 */

/**
 * Module-level, so it survives the remount that navigation causes but resets on
 * a full page load. It exists to keep the *first* paint ungated: nothing should
 * fade in on load, per the design rules. Only subsequent client-side
 * navigations animate.
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
	const reduceMotion = usePrefersReducedMotion();
	const pathname = usePathname();
	// Read during the first render so server and client agree, then latch.
	const [animateIn] = useState(hasNavigated);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		hasNavigated = true;
	}, []);

	// The homepage owns the full viewport and a `position: fixed` cursor; it is
	// deliberately never wrapped.
	if (reduceMotion || !animateIn || pathname === '/') {
		return <>{children}</>;
	}

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.base, ease: EASE_OUT }}
			onAnimationComplete={() => {
				// A lingering `transform` — even an identity one — turns this into
				// the containing block for every `position: fixed` descendant, which
				// would break the works drawer. Strip it once the rise is done.
				if (ref.current) {
					ref.current.style.transform = '';
					ref.current.style.willChange = '';
				}
			}}
		>
			{children}
		</motion.div>
	);
}
