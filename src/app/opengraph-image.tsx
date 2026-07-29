import { ImageResponse } from 'next/og';
import { AUTHOR_JOB_TITLE, SITE_NAME } from './site';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Share card. Deliberately reuses the site's own vocabulary — #1d1d1d ground,
 * oversized light-weight type, wide tracking, a single white hairline — so a
 * pasted link reads as the same object as the landing page.
 */
export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: '#1d1d1d',
					padding: '72px 80px',
				}}
			>
				<div
					style={{
						display: 'flex',
						fontSize: 28,
						letterSpacing: 8,
						color: '#898989',
					}}
				>
					DB
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{['ONE', 'PORTFOLIO BY', 'DIEGO BURGOS.'].map((line) => (
						<div
							key={line}
							style={{
								display: 'flex',
								fontSize: 104,
								fontWeight: 300,
								letterSpacing: 12,
								lineHeight: 1.1,
								color: '#ededed',
							}}
						>
							{line}
						</div>
					))}
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div
						style={{
							display: 'flex',
							width: '100%',
							height: 1,
							backgroundColor: '#6a6a6a',
							marginBottom: 24,
						}}
					/>
					<div
						style={{
							display: 'flex',
							fontSize: 30,
							letterSpacing: 4,
							color: '#898989',
						}}
					>
						{AUTHOR_JOB_TITLE} — UI/UX Developer
					</div>
				</div>
			</div>
		),
		size
	);
}
