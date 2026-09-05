import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Gallery from '../components/gallery';
import PageHeader from '../components/page-header';

const spaceGrotesk = Space_Grotesk({
	weight: '300',
	subsets: ['latin'],
});
export const metadata: Metadata = {
	title: 'Works',
	description:
		'Selected frontend and UI/UX work by Diego Burgos — websites and app prototypes built with React, Next.js, Tailwind CSS and Figma.',
	alternates: { canonical: '/works' },
};

export default function Works() {
	const works = [
		{
			name: 'Art Gallery Website',
			description: 'Website for the paintings of an artist.',
			bgPhoto: 'work-art-gallery.png',
			tags: ['React', 'Javascript', 'Scss', 'Html'],
			about:
				'Art Gallery Website was a university project where I was tasked with building a website that integrated an AWS service. I created an online portfolio to showcase my dad’s paintings, allowing visitors to view his artwork and contact him for commissions. The site is currently deprecated due to the discontinuation of the AWS hosting service.',

			github: 'https://github.com/nefta2/gallery-art',
		},
		{
			name: 'Green Trades Design',
			description:
				'Prototype for an app dedicated to trading second hand products.',
			bgPhoto: 'work-green-trades.png',
			tags: ['Figma', 'UI/UX'],
			about:
				'Green Trades was a college project in which we developed a prototype for an app that facilitates online trading of second-hand products. I was responsible for designing the login and sign-up screens.',
			figma:
				'https://www.figma.com/proto/hSuPPy8KKudIshyfztvqcT/Green-Trades?node-id=166-3729&t=Y1Y33G24qyN8d4jA-1',
		},
		{
			name: 'One Portfolio By Diego Burgos',
			description: 'My personal portfolio website.',
			bgPhoto: 'works-diego-portfolio.gif',
			tags: ['Next.js', 'Javascript', 'Tailwind'],
			about:
				'I designed and developed my personal portfolio website with a focus on simplicity, clean layout, and intuitive navigation. My goal was to create a modern and distinctive design that incorporates current 2025 design trends, including subtle motion elements and interactive visuals.',
			github: 'https://github.com/nefta2/portfolio_2025',
		},
		{
			name: 'Best Friend Ever',
			description: 'Lowkey a job to be this cunty every single day.',
			bgPhoto: 'entes.png',
			tags: ['Bitch.js', 'Bratscript', 'Tailcunt'],
			about:
				'Me encanta el combo 9 de Burger King',
			github: 'https://github.com/nefta2/portfolio_2025',
		},
	];
	return (
		<div
			className={`${spaceGrotesk.className} flex flex-col h-full mx-5 my-5 lg:mx-40`}
		>
			<PageHeader
				eyebrow="Works"
				title="Selected work."
				intro="University projects, design prototypes, and the site you’re on. Click any card for the full story."
			/>

			{/* The grid keeps its images deliberately: on a works page the screenshots
			    are the content, so this is the one list that isn't collapsed into
			    hairline rows. The cards carry the same `(01)` index motif instead. */}
			<Gallery items={works} />
		</div>
	);
}
