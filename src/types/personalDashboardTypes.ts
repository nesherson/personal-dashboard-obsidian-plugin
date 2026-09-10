export interface PersonalDashboardState {
	captureItems: CaptureItem[];
}

export const TAGS = ['Idea', 'Task', 'Note'] as const;

export type Tag = (typeof TAGS)[number];

export const DEFAULT_TAG: Tag = 'Note';

export const isTag = (value: unknown): value is Tag =>
	TAGS.includes(value as Tag);

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
	title: string;
	text: string;
	tag: Tag;
	time: number;
}
