import { useMemo, useSyncExternalStore } from 'react';

import PersonalDashboardPlugin from '@/main';
import { CenterPanel } from './CenterPanel';
import { PersonalDashboardContext } from '@/context/personalDashboardContext';

interface AppProps {
	plugin: PersonalDashboardPlugin;
}

export function App({ plugin }: AppProps) {
	const areas = useSyncExternalStore(
		plugin.areaStore.subscribe,
		plugin.areaStore.getSnapshot,
	);

	const ctx = useMemo(() => ({ app: plugin.app }), [plugin.app]);

	return (
		<PersonalDashboardContext.Provider value={ctx}>
			<CenterPanel areas={areas} />
		</PersonalDashboardContext.Provider>
	);
}
