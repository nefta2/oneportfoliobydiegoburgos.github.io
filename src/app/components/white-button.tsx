'use client';
import { useRouter } from 'next/navigation';

interface WhiteButtonProps {
	title: string;
	horizontalPadding?: number;
	verticalPadding?: number;
	width?: number;
	route?: string;
}

/**
 * Outlined button with a fill that wipes up from the bottom edge on hover, the
 * label inverting to the page ground as it passes. No new colour — it is the
 * existing white-on-#1d1d1d contrast, swapped.
 */
export default function WhiteButton({
	title,
	horizontalPadding,
	verticalPadding,
	width,
	route,
}: WhiteButtonProps) {
	const router = useRouter();

	const clickButton = () => {
		if (route) {
			router.push(route);
		} else {
			console.error('Route is undefined');
		}
	};

	return (
		<button
			className="group relative overflow-hidden border-1 border-solid border-white rounded-lg text-[18px] transition-transform duration-200 ease-editorial hover:scale-[1.02] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
			style={{
				width,
				// Tailwind cannot see runtime-interpolated class names, so the
				// caller-supplied padding has to be a real inline style. `p-3` (12px)
				// stays the default so existing call sites look unchanged.
				paddingInline: horizontalPadding ?? 12,
				paddingBlock: verticalPadding ?? 12,
			}}
			onClick={clickButton}
		>
			<span
				aria-hidden="true"
				className="absolute inset-0 bg-white origin-bottom scale-y-0 transition-transform duration-500 ease-editorial group-hover:scale-y-100 group-focus-visible:scale-y-100"
			/>
			<span className="relative transition-colors duration-300 ease-editorial group-hover:text-[#1d1d1d] group-focus-visible:text-[#1d1d1d]">
				{title}
			</span>
		</button>
	);
}
