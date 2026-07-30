import Reveal, { RevealItem } from './reveal';

interface PageHeaderProps {
	/** Small parenthetical label above the statement. Rendered uppercase. */
	eyebrow: string;
	/** The oversized statement that carries the page. Rendered uppercase. */
	title: string;
	/** Optional muted paragraph under the statement. */
	intro?: string;
}

/**
 * The opening of every page except `/`.
 *
 * `(EYEBROW)` → oversized `gradient-text` statement → optional muted intro.
 * It exists so `/about`, `/works` and `/contact-me` cannot drift apart: the
 * scale ramp, tracking and spacing live here once.
 *
 * Both lines sit inside the single `h1`, so the heading's text content still
 * names the page's subject for search while the statement carries it visually.
 *
 * A server component — only the `Reveal` wrappers inside it are `'use client'`.
 */
export default function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
	return (
		<Reveal stagger amount={0.1} className="flex flex-col w-full">
			<RevealItem>
				<h1 className="flex flex-col gap-6 lg:gap-8 pt-6 lg:pt-16">
					<span className="text-[12px] lg:text-[14px] tracking-[0.3em] uppercase text-[#898989]">
						({eyebrow})
					</span>
					<span className="gradient-text animate-gradient text-transparent uppercase text-[42px] xs:text-[52px] sm:text-[72px] md:text-[90px] lg:text-[110px] leading-[0.95] tracking-[2px] sm:tracking-[4px] lg:tracking-[6px]">
						{title}
					</span>
				</h1>
			</RevealItem>

			{intro && (
				<RevealItem>
					<p className="max-w-[520px] text-[16px] lg:text-[18px] text-[#898989] pt-8 pb-12 lg:pt-12 lg:pb-20">
						{intro}
					</p>
				</RevealItem>
			)}
		</Reveal>
	);
}

/**
 * Section break inside a page — the page header's rhythm at a smaller scale.
 * Used for `/about`'s two lists.
 */
export function SectionHeading({ children }: { children: string }) {
	return (
		<Reveal amount={0.5} y={16}>
			<h2 className="gradient-text animate-gradient text-transparent uppercase text-[28px] sm:text-[36px] lg:text-[48px] leading-none tracking-[1px] lg:tracking-[3px] pt-16 pb-8 lg:pt-24 lg:pb-10">
				{children}
			</h2>
		</Reveal>
	);
}
