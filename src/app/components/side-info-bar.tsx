'use client';
import { Space_Grotesk } from 'next/font/google';
import TagsGroup from './tags-group';
import './gallery.css';
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

const spaceGrotesk = Space_Grotesk({
	weight: '400',
	subsets: ['latin'],
});

interface SideInfoBar {
	title: string;
	smDescription: string;
	about?: string;
	tags?: string[];
	github?: string;
	close?: () => void;
	figma?: string;
	isMobile?: boolean;
}

export default function SideInfoBar({
	title,
	smDescription,
	about,
	tags,
	close,
	github,
	figma,
	isMobile,
}: SideInfoBar) {
	const sideBarRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!isMobile || !close) return;

		let touchStartY = 0;

		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const touchEndY = e.touches[0].clientY;
			const deltaY = touchEndY - touchStartY;

			const sidebar = sideBarRef.current;
			if (!sidebar) return;

			if (sidebar.scrollTop === 0 && deltaY > 50) {
				close();
			}
		};

		const sidebar = sideBarRef.current;
		if (sidebar) {
			sidebar.addEventListener('touchstart', handleTouchStart);
			sidebar.addEventListener('touchmove', handleTouchMove);
		}

		return () => {
			if (sidebar) {
				sidebar.removeEventListener('touchstart', handleTouchStart);
				sidebar.removeEventListener('touchmove', handleTouchMove);
			}
		};
	}, [isMobile, close]);

	return (
		<div
			ref={sideBarRef}
			className={`${spaceGrotesk.className} overscroll-contain flex flex-col gap-10 top-0 max-h-full overflow-y-auto right-0 h-full pb-40  p-5 px-10 translate-x-0 z-50`}
		>
			<div className="flex flex-row flex-start cursor-pointer" onClick={close}>
				{isMobile ? (
					<ChevronDownIcon className="w-10 h-10" strokeWidth={1} />
				) : (
					<ChevronLeftIcon className="w-10 h-10" strokeWidth={1} />
				)}
			</div>
			<div className="flex flex-col gap-2">
				<h2>
					<span className="text-[40px] font-bold">{title}</span>
				</h2>
				<p>
					<span className="text-[16px] font-medium">{smDescription}</span>
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<h3>
					<span className="text-[30px] font-bold">About</span>
				</h3>
				<p>
					<span className="text-[16px] font-medium">{about}</span>
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<h3>
					<span className="text-[30px] font-bold">Tags</span>
				</h3>
				<TagsGroup tags={tags || []} />
			</div>

			{github && (
				<div className="flex flex-col gap-2">
					<h3>
						<span className="text-[30px] font-bold flex flex-row gap-2 items-center">
							{' '}
							<Image
								src="/github-mark-white.png"
								alt="GitHub Logo"
								width={5}
								height={5}
								className="w-5 h-5"
								priority
							/>{' '}
							Github
						</span>
					</h3>
					<a
						href={github}
						target="_blank"
						className="text-[#898989] hover:underline text-[16px] lg:text-[18px]"
					>
						{github}
					</a>
				</div>
			)}
			{figma && (
				<div className="flex flex-col gap-2">
					<h3>
						<span className="text-[30px] font-bold flex flex-row gap-2 items-center">
							{' '}
							<svg
								width="20"
								height="20"
								viewBox="0 0 417 600"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M50.969 206.036C20.285 186.042 0 151.426 0 112.071C0 50.176 50.176 0 112.071 0H304.085C365.98 0 416.156 50.176 416.156 112.071C416.156 151.426 395.872 186.042 365.187 206.036C395.872 226.03 416.156 260.647 416.156 300.001C416.156 361.896 365.98 412.072 304.085 412.072H302.042C272.784 412.072 246.144 400.86 226.185 382.498V486.907C226.185 549.494 174.911 600 112.579 600C50.811 600 0 549.951 0 487.929C0 448.575 20.284 413.959 50.967 393.965C20.284 373.971 0 339.355 0 300.001C0 260.647 20.285 226.03 50.969 206.036ZM226.185 300.001C226.185 341.896 260.148 375.858 302.042 375.858H304.085C345.98 375.858 379.942 341.896 379.942 300.001C379.942 258.106 345.98 224.144 304.085 224.144H302.042C260.148 224.144 226.185 258.106 226.185 300.001ZM189.971 224.144H112.071C70.176 224.144 36.214 258.106 36.214 300.001C36.214 341.811 70.039 375.72 111.816 375.858H111.935H189.971V224.144ZM112.071 412.072C111.986 412.072 111.901 412.072 111.816 412.072C70.039 412.209 36.214 446.119 36.214 487.929C36.214 529.697 70.557 563.786 112.579 563.786C155.165 563.786 189.971 529.24 189.971 486.907V412.072H112.071ZM189.971 187.928H112.071C70.176 187.928 36.214 153.966 36.214 112.071C36.214 70.176 70.176 36.214 112.071 36.214H189.971V187.928ZM304.085 187.928H226.185V36.214H304.085C345.98 36.214 379.942 70.176 379.942 112.071C379.942 153.966 345.98 187.928 304.085 187.928Z"
									fill="white"
								/>
							</svg>
							Figma
						</span>
					</h3>
					<a
						href={figma}
						target="_blank"
						className="text-[#898989] hover:underline  text-[16px] lg:text-[18px]"
					>
						Click here to check design
					</a>
				</div>
			)}
		</div>
	);
}
