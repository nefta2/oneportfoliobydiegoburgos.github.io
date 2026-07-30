'use client';

interface TagsGroupProps {
	tags: string[];
}

/**
 * Rendered with `span`s rather than `div`s because the gallery card places this
 * inside a `button`, which only accepts phrasing content. Tags are labels, not
 * controls, so they deliberately have no hover state.
 */
export default function TagsGroup({ tags }: TagsGroupProps) {
	return (
		<span className="flex flex-row flex-wrap gap-3 relative">
			{tags.map((tag) => (
				<span
					key={tag}
					className="bg-[#454545] py-2 px-4 rounded-full text-[12px]"
				>
					{tag}
				</span>
			))}
		</span>
	);
}
