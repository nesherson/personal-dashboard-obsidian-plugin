import { useMemo, useSyncExternalStore } from 'react';

import PersonalDashboardPlugin from '@/main';
import { AreaView } from './AreaView';
import {
	PersonalDashboardContext,
} from '@/context/personalDashboardContext';
import { RightPanel } from './RightPanel/RightPanel';

interface AppProps {
	plugin: PersonalDashboardPlugin;
}

export function App({ plugin }: AppProps) {
	const areas = useSyncExternalStore(
		plugin.areaStore.subscribe,
		plugin.areaStore.getSnapshot,
	);
	const capturedItems = useSyncExternalStore(
		plugin.capturedItemsStore.subscribe,
		plugin.capturedItemsStore.getSnapshot
	);

	const ctx = useMemo(
		() => ({ app: plugin.app }),
		[plugin.app],
	);

	return (
		<PersonalDashboardContext.Provider value={ctx}>
			<div className="main">
				<AreaView areas={areas} />
				<RightPanel
					items={capturedItems}
					plugin={plugin}
					onFile={() => {}}
					onArchive={() => {}}
					onOpen={() => {}}
				/>
			</div>
		</PersonalDashboardContext.Provider>
	);
}
