export interface PersonalDashboardState {
	areas: Area[];
}

export interface Area {
	id: string;
	title: string;
	href: string;
	image?: string;
	icon?: string;
	preview: string;
	meta: string;
}
