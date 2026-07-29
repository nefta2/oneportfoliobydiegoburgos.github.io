import type { MetadataRoute } from 'next';
import { SITE_URL } from './site';

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return [
		{ url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
		{
			url: `${SITE_URL}/about`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/works`,
			lastModified,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/contact-me`,
			lastModified,
			changeFrequency: 'yearly',
			priority: 0.5,
		},
	];
}
