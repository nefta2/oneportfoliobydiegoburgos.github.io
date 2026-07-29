import { Meta, StoryObj } from '@storybook/nextjs-vite';
import './navigation-bar.css';

import NavigationBar from './navigation-bar';

const meta = {
	component: NavigationBar,
} satisfies Meta<typeof NavigationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// NavigationBar takes no props; it renders from the current pathname and hides
// itself on `/`.
export const Primary: Story = {};
