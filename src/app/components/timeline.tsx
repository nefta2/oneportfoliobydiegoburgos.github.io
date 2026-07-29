'use client';

interface TimelineItem {
	title: string;
	year?: string | number;
	description: string;
}

interface WhiteButtonProps {
	data: TimelineItem[];
}

export default function Timeline({ data }: WhiteButtonProps) {
	return data.map((x: TimelineItem, index) => {
		return (
			<div
				key={index}
				className="flex flex-col gap-5 relative border-solid border-l-1 pl-[20px] pb-8"
			>
				<div className="w-full flex flex-row justify-between gap-2 text-[20px] md:text-[26px]">
					<div className="w-3 h-3 left-[-6px] bg-white rounded-full absolute"></div>
					<h3>{x.title}</h3>
					<span>{x?.year}</span>
				</div>
				<div className="text-[12px] md:text-[16px]">
					<p>{x.description}</p>
				</div>
			</div>
		);
	});
}
