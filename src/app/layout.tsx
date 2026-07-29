import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import NavigationBar from './components/navigation-bar';
import {
	AUTHOR_JOB_TITLE,
	AUTHOR_NAME,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	SOCIAL_LINKS,
} from './site';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		// `/` is a client component and cannot export metadata, so this default
		// is the homepage's title.
		default: `${AUTHOR_NAME} — ${AUTHOR_JOB_TITLE} & UI/UX Developer`,
		template: `%s — ${AUTHOR_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
	creator: AUTHOR_NAME,
	keywords: [
		AUTHOR_NAME,
		'frontend developer',
		'frontend engineer',
		'UI/UX developer',
		'React',
		'Next.js',
		'TypeScript',
		'portfolio',
	],
	alternates: { canonical: '/' },
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		title: `${AUTHOR_NAME} — ${AUTHOR_JOB_TITLE} & UI/UX Developer`,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: `${AUTHOR_NAME} — ${AUTHOR_JOB_TITLE} & UI/UX Developer`,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
	},
	icons: { icon: '/DB.ico' },
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	// Matches the page ground so mobile browser chrome blends into the design.
	themeColor: '#1d1d1d',
};

/**
 * Tells Google the site *is* the entity "Diego Burgos" and links it to the
 * profiles that already rank for that name.
 */
const personJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: AUTHOR_NAME,
	url: SITE_URL,
	jobTitle: AUTHOR_JOB_TITLE,
	description: SITE_DESCRIPTION,
	image: `${SITE_URL}/about-me.jpg`,
	sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			{/* The icon and viewport now come from the `metadata`/`viewport`
			    exports above, so no manual <head> is needed. */}
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<header>
					<NavigationBar />
				</header>
				{children}
			</body>
		</html>
	);
}
