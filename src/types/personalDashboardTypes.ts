export interface PersonalDashboardState {
	captureItems: CaptureItem[];
}

export const TAGS = ['Idea', 'Task', 'Note'];

export type Tag = 'Idea' | 'Task' | 'Note';

export interface Area {
	id: string;
	title: string;
	href: string;
	image?: string;
	icon?: string;
	preview: string;
	meta: string;
}

export interface CaptureItem {
	id: string;
	text: string;
	tag: Tag;
	time: number;
}
