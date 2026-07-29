import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import WhiteButton from '../components/white-button';
import Timeline from '../components/timeline';
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
		<>
			<div
				className={`${spaceGrotesk.className} mx-10 my-10 lg:mx-35 lg:my-10`}
			>
				<div
					className={`flex flex-col lg:flex-row gap-5 lg:gap-10 items-center justify-between h-full mb-10 lg:mb-20 mt-5 lg:mt-10`}
				>
					<div className="flex flex-col gap-10 text-center items-center lg:items-start lg:text-left">
						<div>
							<p className="text-[18px] lg:text-[46px]">
								Thank you for coming here,
							</p>
							<h1 className="text-[42px] lg:text-[64px]">
								My name is{' '}
								<span className="gradient-text px-4 size-[-webkit-fill-available] text-center sm:text-left text-transparent animate-gradient h-full sm:h-[60%]">
									Diego Burgos
								</span>
							</h1>
						</div>
						<p className="text-[16px] lg:text-[18px] max-w-[650px]">
							I’m a software engineer currently working as a frontend developer,
							I’m enhanced by innovation and creative solutions oriented to
							satisfy user experience and needs.
						</p>
						<WhiteButton
							title="Contact me"
							horizontalPadding={60}
							route="/contact-me"
							width={250}
						/>
					</div>
					<div>
						<Image
							src="/about-me.jpg"
							alt="Diego Burgos at a museum"
							width={500}
							height={900}
							priority
						/>
					</div>
				</div>
				<hr className="w-full max-w-[1000px] mx-auto border-t border-white opacity-50" />

				<div>
					<h2 className="text-[32px] lg:text-[40px] py-10">
						<span className="gradient-text px-4 size-[-webkit-fill-available] text-center sm:text-left text-transparent animate-gradient h-full sm:h-[60%]">
							My Experience
						</span>
					</h2>
					<Timeline data={workExperience} />
				</div>
				<div>
					<h2 className="text-[32px] lg:text-[40px] py-10">
						<span className="gradient-text px-4 size-[-webkit-fill-available] text-center sm:text-left text-transparent animate-gradient h-full sm:h-[60%]">
							Tech Stacks I Use
						</span>
					</h2>
					<Timeline data={techStacks} />
				</div>
			</div>
		</>
	);
}
