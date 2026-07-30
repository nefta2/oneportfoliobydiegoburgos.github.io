import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import { SOCIAL_LINKS } from '../site';
import Reveal, { RevealItem } from '../components/reveal';
import PageHeader from '../components/page-header';

const spaceGrotesk = Space_Grotesk({
	weight: '300',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Contact Me',
	description:
		'Get in touch with Diego Burgos, frontend engineer and UI/UX developer, on GitHub, LinkedIn or WhatsApp.',
	alternates: { canonical: '/contact-me' },
};

/**
 * `meta` is the handle shown on the right of each row. Every value is derived
 * from the URL it sits next to — nothing here is decorative copy.
 */
const CHANNELS = [
	{
		href: SOCIAL_LINKS.github,
		label: 'Github',
		meta: '@nefta2',
		src: '/github-mark-white.png',
	},
	{
		href: SOCIAL_LINKS.linkedin,
		label: 'Linkedin',
		meta: 'Diego Burgos',
		src: '/InBug-White.png',
	},
	{
		href: SOCIAL_LINKS.whatsapp,
		label: 'Whatsapp',
		meta: '+507 6833 5788',
		src: '/whats-logo.png',
	},
];

export default function ContactMe() {
	return (
		<div
			className={`${spaceGrotesk.className} flex flex-col h-full mx-5 my-5 lg:mx-40`}
		>
			<PageHeader
				eyebrow="Contact me"
				title="Let’s make something."
				intro="Three ways to reach me. Pick whichever is easiest — I answer to all of them."
			/>

			{/*
			 * The rows are the layout. Each is a full-bleed hairline band; on hover a
			 * white fill wipes across it and the whole row inverts to the page ground.
			 * All of it is CSS `group-hover`, so this page stays a server component.
			 */}
			<Reveal
				as="ul"
				stagger
				amount={0.1}
				className="w-full border-b-[0.5px] border-white"
			>
				{CHANNELS.map(({ href, label, meta, src }, i) => (
					<RevealItem
						as="li"
						key={label}
						className="border-t-[0.5px] border-white"
					>
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer me"
							// `isolate` keeps the logo's difference blend inside the row, so
							// it reads white against the page and black once the fill is
							// under it.
							className="group isolate relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-4"
						>
							{/* Wipes in from the left, out to the right — the same gesture as
							    the nav underline, at full-row scale. */}
							<span
								aria-hidden="true"
								className="absolute inset-0 bg-white origin-right scale-x-0 transition-transform duration-500 ease-editorial group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
							/>

							{/*
							 * `mix-blend-difference` rather than a colour transition on
							 * hover. A transition inverts the whole row on its own clock, so
							 * the text on the right flipped to dark while the white fill was
							 * still crossing the middle and briefly went dark-on-dark. The
							 * blend inverts each pixel exactly where the fill is, so the
							 * row's contents flip *with* the wipe instead of racing it.
							 */}
							<span className="relative flex items-center gap-4 sm:gap-8 py-6 lg:py-8 mix-blend-difference">
								{/* The index rolls over to an arrow — same two-layer swap as
								    every other label on the site. */}
								<span className="text-roll text-[12px] lg:text-[14px] tracking-[0.25em] text-[#898989]">
									<span className="text-roll__layer">
										({String(i + 1).padStart(2, '0')})
									</span>
									<span
										aria-hidden="true"
										className="text-roll__layer text-roll__layer--incoming"
									>
										&#8599;
									</span>
								</span>

								<span className="text-roll uppercase text-[28px] sm:text-[40px] lg:text-[56px] leading-none">
									<span className="text-roll__layer">{label}</span>
									<span
										aria-hidden="true"
										className="text-roll__layer text-roll__layer--incoming"
									>
										{label}
									</span>
								</span>

								<span className="ml-auto flex items-center gap-4 sm:gap-6">
									<span className="hidden sm:block text-[14px] lg:text-[16px] text-[#898989]">
										{meta}
									</span>
									{/* Decorative: the row is already labelled by its text. The
									    logos are white PNGs, so without the row's blend they
									    would vanish the moment the fill passed under them. */}
									<Image
										src={src}
										alt=""
										aria-hidden="true"
										width={32}
										height={32}
										className="h-6 lg:h-8 w-auto object-contain"
										priority
									/>
								</span>
							</span>
						</a>
					</RevealItem>
				))}
			</Reveal>
		</div>
	);
}
