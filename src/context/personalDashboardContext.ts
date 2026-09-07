import { App } from 'obsidian';
import { createContext, useContext } from 'react';

interface PersonalDashboardContextType {
	app: App;
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
