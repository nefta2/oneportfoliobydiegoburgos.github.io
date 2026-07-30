'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DURATION, EASE_OUT, STAGGER, VIEWPORT } from '../motion';
import { usePrefersReducedMotion } from '../hooks';

/**
 * Elements the wrappers can render as. `ul`/`li` exist so a reveal can wrap a
 * real list without putting a `div` between the `ul` and its `li`s.
 */
type RevealTag = 'div' | 'ul' | 'li';

const MOTION_TAG = {
	div: motion.div,
	ul: motion.ul,
	li: motion.li,
} as const;

interface RevealProps {
	children: ReactNode;
	className?: string;
	/** Seconds to wait after the block scrolls into view. */
	delay?: number;
	/** Travel distance in px. Use less for small items, more for full sections. */
	y?: number;
	/**
	 * Reveal each direct child on its own, `STAGGER` seconds apart, instead of
	 * moving the whole block as one piece.
	 */
	stagger?: boolean;
	/** Fraction of the block that must be visible before it fires. */
	amount?: number;
	/** Element to render. Defaults to `div`. */
	as?: RevealTag;
}

/**
 * Scroll-reveal wrapper. Exists so `/about`, `/works` and `/contact-me` can keep
 * their page shells as server components — only this leaf is `'use client'`.
 *
 * Renders a plain element under `prefers-reduced-motion`, so content is never
 * gated behind an animation that will not play.
 */
export default function Reveal({
	children,
	className,
	delay = 0,
	y = 24,
	stagger = false,
	amount = VIEWPORT.amount,
	as = 'div',
}: RevealProps) {
	const reduceMotion = usePrefersReducedMotion();
	const Tag = as;
	const MotionTag = MOTION_TAG[as];

	if (reduceMotion) {
		return <Tag className={className}>{children}</Tag>;
	}

	if (stagger) {
		return (
			<MotionTag
				className={className}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: VIEWPORT.once, amount }}
				variants={{
					hidden: {},
					visible: {
						transition: { staggerChildren: STAGGER, delayChildren: delay },
					},
				}}
			>
				{children}
			</MotionTag>
		);
	}

	return (
		<MotionTag
			className={className}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: VIEWPORT.once, amount }}
			transition={{ duration: DURATION.base, delay, ease: EASE_OUT }}
		>
			{children}
		</MotionTag>
	);
}

/** A direct child of `<Reveal stagger>`. Inherits the parent's timing. */
export function RevealItem({
	children,
	className,
	y = 24,
	as = 'div',
}: {
	children: ReactNode;
	className?: string;
	y?: number;
	as?: RevealTag;
}) {
	const reduceMotion = usePrefersReducedMotion();
	const Tag = as;
	const MotionTag = MOTION_TAG[as];

	if (reduceMotion) {
		return <Tag className={className}>{children}</Tag>;
	}

	return (
		<MotionTag
			className={className}
			variants={{
				hidden: { opacity: 0, y },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: DURATION.base, ease: EASE_OUT },
				},
			}}
		>
			{children}
		</MotionTag>
	);
}
