'use client';
import { motion } from 'framer-motion';
import { DURATION, EASE_OUT, STAGGER } from '../motion';
import { usePrefersReducedMotion } from '../hooks';

interface TimelineItem {
	title: string;
	year?: string | number;
	description: string;
}

interface TimelineProps {
	data: TimelineItem[];
}

const row = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: DURATION.base, ease: EASE_OUT },
	},
};

/**
 * Hairline-separated index rows — the same band layout as the contact
 * channels, minus the hover wipe, because these entries are not links and a
 * hover state on something you cannot click is a lie.
 *
 * Replaces the old left-rule-and-dot treatment so `/about` and `/contact-me`
 * present their lists the same way.
 */
export default function Timeline({ data }: TimelineProps) {
	const reduceMotion = usePrefersReducedMotion();

	const rows = data.map((entry, index) => (
		<motion.li
			key={`${entry.title}-${index}`}
			className="border-t-[0.5px] border-white"
			variants={reduceMotion ? undefined : row}
		>
			<div className="flex gap-4 sm:gap-8 py-6 lg:py-8">
				<span className="shrink-0 pt-1 lg:pt-2 text-[12px] lg:text-[14px] tracking-[0.25em] text-[#898989]">
					({String(index + 1).padStart(2, '0')})
				</span>

				<div className="flex flex-1 flex-col gap-3 lg:gap-4">
					<div className="flex items-baseline justify-between gap-4">
						<h3 className="uppercase text-[22px] sm:text-[28px] lg:text-[36px] leading-none">
							{entry.title}
						</h3>
						{entry.year && (
							<span className="shrink-0 text-[12px] lg:text-[14px] tracking-[0.25em] text-[#898989]">
								{entry.year}
							</span>
						)}
					</div>
					<p className="max-w-[75ch] text-[14px] lg:text-[16px] text-[#898989]">
						{entry.description}
					</p>
				</div>
			</div>
		</motion.li>
	));

	if (reduceMotion) {
		return (
			<ul className="w-full border-b-[0.5px] border-white">{rows}</ul>
		);
	}

	return (
		<motion.ul
			className="w-full border-b-[0.5px] border-white"
			initial="hidden"
			whileInView="visible"
			// Lower than the site default: these lists run taller than the viewport,
			// so waiting for 30% of the whole list would hold the first row back.
			viewport={{ once: true, amount: 0.1 }}
			variants={{
				hidden: {},
				visible: { transition: { staggerChildren: STAGGER } },
			}}
		>
			{rows}
		</motion.ul>
	);
}
