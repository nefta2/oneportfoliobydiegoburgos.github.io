import { Meta, StoryObj } from '@storybook/nextjs-vite';

import WhiteButton from './white-button';

const meta = {
	component: WhiteButton,
} satisfies Meta<typeof WhiteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		title: 'Contact me',
		route: '/contact-me',
		width: 250,
	},
};
