import { Area, PersonalDashboardState } from '@/types/personalDashboardTypes';

export type PersonalDashboardAction = {
	type: 'LOAD_AREAS';
	payload: Area[];
};

export function personalDashboardReducer(
	state: PersonalDashboardState,
	action: PersonalDashboardAction,
) {
	switch (action.type) {
		case 'LOAD_AREAS':
			return {
				...state,
				areas: action.payload,
			};
	}
}
