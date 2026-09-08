import {
	CaptureItem,
	PersonalDashboardState,
} from '@/types/personalDashboardTypes';

export type PersonalDashboardAction = {
	type: 'ADD_CAPTURE_ITEM';
	payload: CaptureItem;
};

export function personalDashboardReducer(
	state: PersonalDashboardState,
	action: PersonalDashboardAction,
) {
	switch (action.type) {
		case 'ADD_CAPTURE_ITEM':
			return {
				...state,
				captureItems: [...state.captureItems, action.payload],
			};
	}
}
