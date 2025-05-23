'use client';

interface TagsGroupProps {
	tags: string[];
}

export default function TagsGroup({ tags }: TagsGroupProps) {
	return (
		<div className="flex flex-row flex-wrap gap-3  relative">
			{tags.map((x: string, index) => {
				return (
					<div
						key={index}
						className="bg-[#454545] py-2 px-4 rounded-full text-[12px]"
					>
						{x}
					</div>
				);
			})}
		</div>
	);
}
