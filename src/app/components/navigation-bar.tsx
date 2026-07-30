'use client';
import { Space_Grotesk } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './navigation-bar.css';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DURATION, EASE_IN, EASE_OUT, STAGGER } from '../motion';
import { usePrefersReducedMotion } from '../hooks';

const spaceGrotesk = Space_Grotesk({
	weight: '400',
	subsets: ['latin'],
});

const PAGES = ['about', 'works', 'contact-me'];

/** Two stacked copies of the label; the pair rolls up one line on hover. */
function RollLabel({ children }: { children: string }) {
	return (
		<span className="text-roll">
			<span className="text-roll__layer">{children}</span>
			<span
				aria-hidden="true"
				className="text-roll__layer text-roll__layer--incoming"
			>
				{children}
			</span>
		</span>
	);
}

export default function NavigationBar() {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const reduceMotion = usePrefersReducedMotion();

	const toggleMenu = () => setIsOpen((open) => !open);

	// The overlay covers the page, so the page behind it must not scroll.
	useEffect(() => {
		if (!isOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	}, [isOpen]);

	// Escape closes the overlay, matching the works drawer's dismiss behaviour.
	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [isOpen]);

	return (
		<nav
			className={
				pathname === '/'
					? 'hidden'
					: `${spaceGrotesk.className} relative z-50 flex justify-between items-center text-[18px] p-[25px]`
			}
		>
			{/* Logo */}
			<div>
				<Link
					href="/"
					aria-label="Home"
					className="group nav-link-db inline-block"
				>
					<RollLabel>DB</RollLabel>
				</Link>
			</div>

			{/* Burger Icon */}
			<div className="lg:hidden z-50 transition-opacity duration-300 ease-in-out">
				<button
					onClick={toggleMenu}
					aria-label="Toggle menu"
					aria-expanded={isOpen}
					className={`burger-button ${isOpen ? 'open' : ''}`}
				>
					<span className="line top"></span>
					<span className="line middle"></span>
					<span className="line bottom"></span>
				</button>
			</div>

			<div className="hidden lg:flex gap-10">
				{PAGES.map((page) => {
					const isActive = pathname === `/${page}`;
					return (
						<Link
							key={page}
							href={`/${page}`}
							aria-current={isActive ? 'page' : undefined}
							className={`group relative inline-block ${
								isActive ? 'nav-link-active' : 'nav-link'
							}`}
						>
							<RollLabel>{page.replace('-', ' ')}</RollLabel>
						</Link>
					);
				})}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						key="mobile-menu"
						className="fixed inset-0 bg-black/95 flex flex-col justify-center items-center gap-8 text-2xl text-white lg:hidden z-40"
						initial={reduceMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: DURATION.exit, ease: EASE_IN } }}
						transition={{ duration: DURATION.fast, ease: EASE_OUT }}
					>
						{PAGES.map((page, index) => {
							const isActive = pathname === `/${page}`;
							return (
								// The mask means the link rises out of nothing rather than
								// fading in on the spot — the same entrance the gallery meta
								// and drawer body use.
								<span key={page} className="overflow-hidden py-1">
									<motion.span
										className="block"
										initial={reduceMotion ? false : { y: '110%' }}
										animate={{ y: '0%' }}
										transition={{
											duration: DURATION.base,
											ease: EASE_OUT,
											delay: reduceMotion ? 0 : 0.05 + index * STAGGER,
										}}
									>
										<Link
											href={`/${page}`}
											aria-current={isActive ? 'page' : undefined}
											className={`group inline-block ${
												isActive ? 'nav-link-active' : 'nav-link'
											}`}
											onClick={() => setIsOpen(false)}
										>
											<RollLabel>{page.replace('-', ' ')}</RollLabel>
										</Link>
									</motion.span>
								</span>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
