import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import WhiteButton from '../components/white-button';
import Timeline from '../components/timeline';
import Reveal, { RevealItem } from '../components/reveal';
import PageHeader, { SectionHeading } from '../components/page-header';
import Image from 'next/image';

const spaceGrotesk = Space_Grotesk({
	weight: '300',
	subsets: ['latin'],
});
export const metadata: Metadata = {
	title: 'About Me',
	description:
		'Diego Burgos is a software engineer working as a frontend developer, building user-friendly interfaces with React, Next.js and TypeScript, and designing UI/UX in Figma.',
	alternates: { canonical: '/about' },
};
export default function About() {
	const workExperience = [
		{
			title: 'Cheil',
			year: '2023-2025',
			description:
				'Marketing company under the Samsung Group. Currently working in the Business Intelligence (BI) department as a frontend developer, focusing on delivering user-friendly interfaces for store management systems, vessel and port tracking, and website maintenance. I am also responsible for creating UI/UX designs for the team using Figma. This role allows me to apply the skills I gained during college while also introduces me to real-world concepts of a professional work environment.',
		},
		{
			title: 'Foundever',
			year: '2023',
			description:
				'Working as a customer service representative strengthened my problem-solving abilities, patience, and creativity when addressing challenges. This was a key to further develop my capacity to understand user’s needs and turn them out in requirements to create high quality front-end software. ',
		},
	];
	const techStacks = [
		{
			title: 'Languages & Frameworks',
			description: 'JavaScript, TypeScript, React, Next.js.',
		},
		{
			title: 'Styling',
			description: 'SCSS, CSS, Tailwind CSS.',
		},
		{
			title: 'Tools & Libraries',
			description: 'TanStack Table, Axios, Figma.',
		},
		{
			title: 'Concepts',
			description: 'Responsive Design, UI/UX Principles, API Integration.',
		},
	];
	return (
		<div
			className={`${spaceGrotesk.className} flex flex-col h-full mx-5 my-5 lg:mx-40`}
		>
			<PageHeader eyebrow="About me" title="My name is Diego Burger." />

			<Reveal
				stagger
				amount={0.15}
				// `lg:items-center` because the portrait is much taller than the bio;
				// top-aligning them left a large void under the button.
				className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start lg:items-center justify-between pt-10 lg:pt-16"
			>
				{/* Same classes as the page header's intro, so the bio reads as one
				    family with the intro lines on `/works` and `/contact-me`. */}
				<RevealItem className="flex flex-col gap-8 lg:gap-10 max-w-[520px]">
					<p className="text-[16px] lg:text-[18px] text-[#898989]">
						Hola soy Diego Burgos y me pico una cobra gay en aguadulce y ahora tengo poderes.
						La gente no lo sabe pero me gusta picarme y comerme los mocos cuando nadie mira.
						Soy increible y tengo la mejor personalidad y carisma en todo Panamá.
					</p>
					<WhiteButton
						title="Hombres Gays arrechos a 2km"
						horizontalPadding={60}
						route="/contact-me"
						width={250}
					/>
				</RevealItem>

				<RevealItem className="w-full lg:w-[420px] shrink-0">
					{/* Clipped wrapper so the portrait can settle from a slight
					    over-scale on hover without spilling past its corners. */}
					<div className="overflow-hidden rounded-lg">
						<Image
							src="/about-me.jpg"
							alt="Diego Burgos at a museum"
							width={500}
							height={900}
							className="w-full h-auto transition-transform duration-700 ease-editorial hover:scale-[1.04]"
							priority
						/>
					</div>
				</RevealItem>
			</Reveal>

			<SectionHeading>My Experience</SectionHeading>
			<Timeline data={workExperience} />

			<SectionHeading>Tech Stacks I Use</SectionHeading>
			<Timeline data={techStacks} />
		</div>
	);
}
