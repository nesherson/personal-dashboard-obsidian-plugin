import { PersonalDashboardAction } from '@/store/reducer';
import { PersonalDashboardState } from '@/types/personalDashboardTypes';
import { App } from 'obsidian';
import { createContext, Dispatch, useContext } from 'react';

interface PersonalDashboardContextType {
	app: App;
	state: PersonalDashboardState;
	dispatch: Dispatch<PersonalDashboardAction>;
}

export const PersonalDashboardContext =
	createContext<PersonalDashboardContextType | null>(null);

export function usePersonalDashboardContext() {
	const ctx = useContext(PersonalDashboardContext);

	if (!ctx) {
		throw new Error(
			'usePersonalDashboardContext must be used inside PersonalDashboardContext.Provider',
		);
	}

	return ctx;
}
