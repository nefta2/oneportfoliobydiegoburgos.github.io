'use client';
import TagsGroup from './tags-group';
import './gallery-item.css';
import {
	useFloating,
	useClick,
	useInteractions,
	FloatingPortal,
	FloatingFocusManager,
	useRole,
	useDismiss,
} from '@floating-ui/react';
import SideInfoBar from './side-info-bar';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DURATION, EASE_IN, EASE_OUT, riseVariants } from '../motion';
import { useIsMobileViewport, usePrefersReducedMotion } from '../hooks';

interface itemProps {
	name: string;
	description: string;
	bgPhoto: string;
	tags: string[];
	about?: string;
	github?: string;
	figma?: string;
}

export default function GalleryItem({
	item,
	index = 0,
}: {
	item: itemProps;
	index?: number;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const { context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
	});
	const click = useClick(context);
	const role = useRole(context);
	const dismiss = useDismiss(context, {
		outsidePressEvent: 'mousedown',
	});
	const { getFloatingProps } = useInteractions([click, role, dismiss]);
	const isMobile = useIsMobileViewport();
	const reduceMotion = usePrefersReducedMotion();

	// The panel covers the viewport (mobile) or pins to its edge (desktop); in
	// both cases the page behind it must stop scrolling.
	useEffect(() => {
		if (!isOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	}, [isOpen]);

	/** `(01)`, `(02)` … — the parenthetical index motif from the homepage tiles. */
	const label = `(${String(index + 1).padStart(2, '0')})`;

	const panelBody = (
		<SideInfoBar
			title={item.name}
			smDescription={item.description}
			about={item.about}
			tags={item.tags}
			close={() => setIsOpen(false)}
			github={item.github}
			figma={item.figma}
			isMobile={isMobile}
		/>
	);

	return (
		<motion.div variants={reduceMotion ? undefined : riseVariants}>
			{/*
			 * A real `button`, not a click-handled `div`: the card is the only way
			 * into a project, so it has to be reachable and operable from the
			 * keyboard.
			 */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				className="group relative block w-full h-[400px] rounded-lg overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
			>
				{/* Its own layer so the photo can scale without dragging the card's
				    rounded corners or the overlay copy with it. */}
				<span
					className="block absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-editorial group-hover:scale-[1.06]"
					style={{ backgroundImage: `url(/${item.bgPhoto})` }}
				/>

				<span
					className={`block absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-500 ease-editorial ${
						isOpen ? 'opacity-100' : 'lg:opacity-0 lg:group-hover:opacity-100'
					}`}
				/>

				<span
					aria-hidden="true"
					className="absolute top-5 right-6 text-[12px] tracking-[0.25em] text-white/70 transition-opacity duration-500 ease-editorial lg:opacity-0 lg:group-hover:opacity-100"
				>
					{label}
				</span>

				{/* `span`s throughout: this subtree lives inside a `button`, whose
				    content model only allows phrasing content. */}
				<span className="block absolute bottom-[40px] lg:bottom-0 left-0 w-full p-6 text-white">
					{/* Masked rise: the title climbs out from behind the clip edge
					    instead of fading in on the spot. */}
					<span className="block overflow-hidden pb-[0.16em]">
						<span
							className={`block font-bold text-[20px] md:text-[26px] transition-transform duration-500 ease-editorial ${
								isOpen
									? 'translate-y-0'
									: 'lg:translate-y-[115%] lg:group-hover:translate-y-0'
							}`}
						>
							{item.name}
						</span>
					</span>

					{/* Description and tags follow the title, 80ms apart. */}
					<span
						className={`block text-[16px] transition-all duration-500 delay-75 ease-editorial ${
							isOpen
								? 'opacity-100 translate-y-0'
								: 'lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'
						}`}
					>
						{item.description}
					</span>

					<span
						className={`block pt-3 transition-all duration-500 delay-150 ease-editorial ${
							isOpen
								? 'opacity-100 translate-y-0'
								: 'lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0'
						}`}
					>
						<TagsGroup tags={item.tags} />
					</span>
				</span>
			</button>

			<FloatingPortal>
				<AnimatePresence>
					{isOpen &&
						(isMobile ? (
							// Mobile: full-screen sheet that rises from the bottom edge.
							// Portalled like the desktop drawer so no ancestor transform can
							// turn its `position: fixed` into `absolute`.
							<motion.div
								key="sheet"
								className="fixed inset-0 z-50 bg-[#1d1d1d] lg:hidden pb-[env(safe-area-inset-bottom)]"
								initial={reduceMotion ? false : { y: '100%' }}
								animate={{ y: 0 }}
								exit={{
									y: '100%',
									transition: { duration: DURATION.exit, ease: EASE_IN },
								}}
								transition={{ duration: DURATION.base, ease: EASE_OUT }}
							>
								<FloatingFocusManager context={context} modal={true}>
									<div className="h-full" {...getFloatingProps()}>
										{panelBody}
									</div>
								</FloatingFocusManager>
							</motion.div>
						) : (
							// Desktop: scrim fades, drawer slides in from the right edge.
							<motion.div
								key="drawer"
								className="fixed inset-0 z-50 flex justify-end bg-black/50"
								initial={reduceMotion ? false : { opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{
									opacity: 0,
									transition: { duration: DURATION.exit, ease: EASE_IN },
								}}
								transition={{ duration: DURATION.fast, ease: EASE_OUT }}
							>
								<FloatingFocusManager context={context} modal={true}>
									<motion.div
										className="h-full bg-[#1d1d1d] shadow-lg max-w-lg w-full"
										initial={reduceMotion ? false : { x: '100%' }}
										animate={{ x: 0 }}
										exit={{
											x: '100%',
											transition: { duration: DURATION.exit, ease: EASE_IN },
										}}
										transition={{ duration: DURATION.base, ease: EASE_OUT }}
										{...getFloatingProps()}
									>
										{panelBody}
									</motion.div>
								</FloatingFocusManager>
							</motion.div>
						))}
				</AnimatePresence>
			</FloatingPortal>
		</motion.div>
	);
}
