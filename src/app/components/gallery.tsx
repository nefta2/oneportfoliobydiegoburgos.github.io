'use client';
import './gallery.css';

import { motion } from 'framer-motion';
import GalleryItem from './gallery-item';
import { STAGGER } from '../motion';
import { usePrefersReducedMotion } from '../hooks';

interface itemProps {
	name: string;
	description: string;
	bgPhoto: string;
	tags: string[];
	about?: string;
	github?: string;
	figma?: string;
}

interface GalleryProps {
	items: itemProps[];
}

export default function Gallery({ items }: GalleryProps) {
	const reduceMotion = usePrefersReducedMotion();

	if (reduceMotion) {
		return (
			<div className="grid lg:grid-cols-2 gap-5 w-full">
				{items.map((item, index) => (
					<GalleryItem key={item.name} item={item} index={index} />
				))}
			</div>
		);
	}

	return (
		// The grid is the stagger parent; each card supplies its own rise via
		// `riseVariants`, so cards arrive one after another as the grid scrolls in.
		<motion.div
			className="grid lg:grid-cols-2 gap-5 w-full"
			initial="hidden"
			whileInView="visible"
			// A lower threshold than the site default: the grid is taller than the
			// viewport, so waiting for 30% of it would delay the first card until
			// it had already been on screen for a while.
			viewport={{ once: true, amount: 0.15 }}
			variants={{
				hidden: {},
				visible: { transition: { staggerChildren: STAGGER } },
			}}
		>
			{items.map((item, index) => (
				<GalleryItem key={item.name} item={item} index={index} />
			))}
		</motion.div>
	);
}
