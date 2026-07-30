'use client';
import { Space_Grotesk } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { DURATION, EASE_OUT, SPRING_POINTER } from './motion';
import { useHoverCapable, usePrefersReducedMotion } from './hooks';

const spaceGrotesk = Space_Grotesk({
	weight: '300',
	subsets: ['latin'],
});

const TILES = [
	{ text: '(I) about.', className: 'about-image', route: '/about' },
	{ text: '(II) works.', className: 'works-image', route: '/works' },
	{ text: '(III) contact me.', className: 'contact-me', route: '/contact-me' },
];

const HERO_LINES = ['ONE', 'PORTFOLIO BY', 'DIEGO BURGOS.'];

/** The blob is a 32px circle that is *scaled*, never resized. */
const CURSOR_SIZE = 32;

/**
 * Blob scale and label offset per hover target. Scaling instead of animating
 * width/height keeps the cursor on the compositor.
 * `small` ≈ 100px, `large` ≈ 200px — the two sizes the previous implementation
 * used.
 */
const CURSOR_STATES = {
	default: { scale: 1, labelOffset: 28 },
	small: { scale: 100 / CURSOR_SIZE, labelOffset: 62 },
	large: { scale: 200 / CURSOR_SIZE, labelOffset: 114 },
} as const;

type CursorState = keyof typeof CURSOR_STATES;

export default function Home() {
	const reduceMotion = usePrefersReducedMotion();
	const canHover = useHoverCapable();
	// Only take over the pointer where there is a real one to take over, and
	// never when the visitor has asked for less motion — otherwise `cursor-none`
	// would hide the system cursor with nothing standing in for it.
	const customCursor = canHover && !reduceMotion;

	const [cursorState, setCursorState] = useState<CursorState>('default');
	const [showLabel, setShowLabel] = useState(false);
	const [isPressed, setIsPressed] = useState(false);
	const [hasMoved, setHasMoved] = useState(false);
	const hasMovedRef = useRef(false);

	/*
	 * The pointer position lives in motion values, not state: `mousemove` fires
	 * dozens of times a second and re-rendering the whole homepage on each one
	 * was the single biggest perf cost on the site. Nothing below re-renders
	 * while the pointer moves.
	 */
	const pointerX = useMotionValue(-200);
	const pointerY = useMotionValue(-200);
	const springX = useSpring(pointerX, SPRING_POINTER);
	const springY = useSpring(pointerY, SPRING_POINTER);

	// The blob is positioned by its top-left corner, so pull it back by half its
	// size to centre it on the pointer. Scaling then grows it from that centre.
	const blobX = useTransform(springX, (value) => value - CURSOR_SIZE / 2);
	const blobY = useTransform(springY, (value) => value - CURSOR_SIZE / 2);
	const labelY = useTransform(springY, (value) => value - 9);

	useEffect(() => {
		if (!customCursor) return;

		const handleMove = (event: MouseEvent) => {
			if (!hasMovedRef.current) {
				hasMovedRef.current = true;
				// Snap on the first sighting so the blob doesn't come flying in from
				// its off-screen starting point.
				springX.jump(event.clientX);
				springY.jump(event.clientY);
				setHasMoved(true);
			}
			pointerX.set(event.clientX);
			pointerY.set(event.clientY);
		};

		const handleDown = () => setIsPressed(true);
		const handleUp = () => setIsPressed(false);

		window.addEventListener('mousemove', handleMove);
		window.addEventListener('mousedown', handleDown);
		window.addEventListener('mouseup', handleUp);
		return () => {
			window.removeEventListener('mousemove', handleMove);
			window.removeEventListener('mousedown', handleDown);
			window.removeEventListener('mouseup', handleUp);
		};
	}, [customCursor, pointerX, pointerY, springX, springY]);

	const { scale, labelOffset } = CURSOR_STATES[cursorState];

	return (
		<div
			className={`flex items-center justify-items-center h-[100dvh] overflow-hidden ${
				customCursor ? 'cursor-none' : ''
			}`}
		>
			<main
				className={`${spaceGrotesk.className} w-full flex flex-col row-start-2 items-center sm:items-start h-full`}
			>
				<nav
					aria-label="Primary"
					// `h-[55%]` on the narrow layout, not `h-[90%]`: the tiles and the
					// h1 are siblings in a full-height column, so 90% + 100% overflowed
					// and the clipped container ate the last line of the name.
					className="flex flex-col flex-nowrap h-[55%] sm:flex-row w-full sm:flex-nowrap place-content-around lg:text-[56px] md:text-[30px] sm:h-[40%]"
				>
					{TILES.map(({ text, className, route }, i) => (
						<Link
							key={route}
							href={route}
							onMouseEnter={() => {
								setCursorState('default');
								setShowLabel(true);
							}}
							onMouseLeave={() => {
								setCursorState('default');
								setShowLabel(false);
							}}
							// `cursor-none` is repeated here because the UA stylesheet sets
							// `cursor: pointer` on anchors, which would otherwise beat the
							// value inherited from the page container and show the system
							// pointer alongside the custom cursor.
							className={`group relative flex justify-center items-center text-[16px] md:text-[32px] xl:text-[45px] w-full h-full ${
								customCursor ? 'cursor-none' : ''
							} ${className} bg-cover bg-center focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-8`}
							style={i === 2 ? { backgroundImage: 'url(/sprinkle.svg)' } : {}}
						>
							{/*
							 * The tile edges were `border-b`/`border-r` on this anchor. They
							 * are elements now so they can draw themselves in on first paint
							 * — a border cannot be scaled, a span can.
							 *
							 * They still carry the rule as a 0.5px *border* rather than a
							 * 0.5px-tall background: Chromium snaps a sub-pixel background
							 * box away to nothing, but clamps a sub-pixel border to a
							 * visible hairline. That clamping is what made the original
							 * `border-b-[0.5px]` render at all.
							 */}
							<span
								aria-hidden="true"
								className="hairline-draw absolute bottom-0 left-0 w-full border-b-[0.5px] border-white"
								style={
									{ '--hairline-delay': `${i * 0.1}s` } as React.CSSProperties
								}
							/>
							{i !== 2 && (
								<span
									aria-hidden="true"
									className="hairline-draw-vertical absolute top-0 right-0 h-full border-r-[0.5px] border-white"
									style={
										{
											'--hairline-delay': `${0.1 + i * 0.1}s`,
										} as React.CSSProperties
									}
								/>
							)}

							<span
								className="relative inline-block whitespace-nowrap"
								onMouseEnter={() => {
									setCursorState('small');
									setShowLabel(true);
								}}
								onMouseLeave={() => setCursorState('default')}
							>
								{/* Two stacked copies swap in place on hover — the roll. */}
								<span className="text-roll">
									<span className="text-roll__layer">{text}</span>
									<span
										aria-hidden="true"
										className="text-roll__layer text-roll__layer--incoming"
									>
										{text}
									</span>
								</span>
								{/* Out of flow, so a long label can never be pushed into
								    wrapping to make room for it. */}
								<span
									aria-hidden="true"
									className="absolute top-0 left-full ml-2 md:ml-3 text-[0.6em] opacity-0 -translate-x-2 transition-all duration-300 ease-editorial group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
								>
									&#8599;
								</span>
							</span>
						</Link>
					))}
				</nav>

				<h1 className="gradient-text flex flex-col justify-end  px-4 size-[-webkit-fill-available] tracking-[8px] sm:tracking-[25px] text-center sm:text-left text-transparent animate-gradient h-full sm:h-[60%]">
					{HERO_LINES.map((line) => (
						<span
							key={line}
							onMouseEnter={() => setCursorState('large')}
							onMouseLeave={() => {
								setCursorState('default');
								setShowLabel(false);
							}}
							className="flex flex-col w-full text-start items-start text-[50px] leading-[1.15] xs:leading-[0.95] xs:text-[60px] sm:text-[85px] sm:tracking-[6px] md:text-[110px] md:tracking-[10px] lg:text-[120px] lg:tracking-[14px] xl:text-[145px] 2xl:text-[160px] 2xl:tracking-[25px] 3xl:text-[175px]"
						>
							{/* Trailing space keeps the h1's text content readable as
							    "ONE PORTFOLIO BY DIEGO BURGOS." — without it the
							    block-level spans concatenate into "BYDIEGO" for crawlers
							    and screen readers. Whitespace between flex items is not
							    rendered, so this has no visual effect. */}
							{line + ' '}
						</span>
					))}
				</h1>
			</main>

			{customCursor && (
				<>
					<motion.div
						className="cursor z-50"
						style={{ x: blobX, y: blobY }}
						animate={{
							scale: isPressed ? scale * 0.7 : scale,
							opacity: hasMoved ? 1 : 0,
						}}
						transition={{
							scale: SPRING_POINTER,
							opacity: { duration: DURATION.fast, ease: EASE_OUT },
						}}
					/>

					<motion.div
						className={`${spaceGrotesk.className} cursor-text z-50 text-white`}
						style={{
							x: springX,
							y: labelY,
							// Steps up with the blob, as it did before.
							fontSize: cursorState === 'default' ? 16 : 20,
						}}
					>
						<AnimatePresence>
							{showLabel && (
								<motion.span
									className="block"
									initial={{ opacity: 0, x: labelOffset - 8 }}
									animate={{ opacity: 1, x: labelOffset }}
									exit={{ opacity: 0, x: labelOffset - 8 }}
									transition={{ duration: DURATION.fast, ease: EASE_OUT }}
								>
									Click now!
								</motion.span>
							)}
						</AnimatePresence>
					</motion.div>
				</>
			)}
		</div>
	);
}
