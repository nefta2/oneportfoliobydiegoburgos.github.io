/**
 * Single source of truth for anything that needs the site's absolute origin:
 * metadataBase, canonicals, the sitemap, robots.txt and the JSON-LD graph.
 * If the domain changes, change it here only.
 */
export const SITE_URL = 'https://oneportfoliobydiegoburgos.vercel.app';

export const SITE_NAME = 'One Portfolio by Diego Burgos';

export const AUTHOR_NAME = 'Diego Burgos';

export const AUTHOR_JOB_TITLE = 'Frontend Engineer';

export const SITE_DESCRIPTION =
	'Portfolio of Diego Burgos, a frontend engineer and UI/UX developer building fast, accessible interfaces with React, Next.js and TypeScript.';

/** Used for JSON-LD `sameAs` — the profiles that identify the same person. */
export const SOCIAL_LINKS = {
	github: 'https://github.com/nefta2',
	linkedin:
		'https://linkedin.com/in/diego-nazar-burgos-álvarez-a05947210',
	whatsapp: 'https://wa.me/50768335788',
} as const;
