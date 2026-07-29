import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Image from 'next/image';
import { SOCIAL_LINKS } from '../site';

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
export default function ContactMe() {
	return (
		<div
			className={`${spaceGrotesk.className} flex flex-col  gap-10 items-start  h-full mx-5 my-5 lg:mx-40`}
		>
			<h1 className="flex flex-row items-start w-full text-[30px]">
				Contact me.
			</h1>
			<p className="flex flex-col items-start">
				Below you can click on any of my social media to contact me.
			</p>

			<div className="flex flex-col gap-20 items-center align-middle lg:flex-row lg:gap-10 justify-around w-full">
				{[
					{
						href: SOCIAL_LINKS.github,
						label: 'Github',
						src: '/github-mark-white.png',
						alt: 'GitHub logo',
					},
					{
						href: SOCIAL_LINKS.linkedin,
						label: 'Linkedin',
						src: '/InBug-White.png',
						alt: 'LinkedIn logo',
					},
					{
						href: SOCIAL_LINKS.whatsapp,
						label: 'Whatsapp',
						src: '/whats-logo.png',
						alt: 'WhatsApp logo',
					},
				].map(({ href, label, src, alt }) => (
					<a
						key={label}
						href={href}
						target="_blank"
						rel="noopener noreferrer me"
						className="flex flex-col items-center gap-5"
					>
						<Image
							src={src}
							alt={alt}
							width={100}
							height={25}
							className="cursor-pointer"
							priority
						/>
						<h2>{label}</h2>
					</a>
				))}
			</div>
		</div>
	);
}
