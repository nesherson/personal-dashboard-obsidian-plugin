import { useMemo, useReducer, useSyncExternalStore } from 'react';

import PersonalDashboardPlugin from '@/main';
import { AreaView } from './AreaView';
import {
	PersonalDashboardContext,
	usePersonalDashboardContext,
} from '@/context/personalDashboardContext';
import { RightPanel } from './RightPanel';
import { Tag } from '@/types/personalDashboardTypes';
import { personalDashboardReducer } from '@/store/reducer';

interface AppProps {
	plugin: PersonalDashboardPlugin;
}

const items = [
	{
		id: '1',
		text: 'Ask Marek about the migration',
		time: '14:02',
		tag: 'Task',
	},
];

export function App({ plugin }: AppProps) {
	const areas = useSyncExternalStore(
		plugin.areaStore.subscribe,
		plugin.areaStore.getSnapshot,
	);

	const [state, dispatch] = useReducer(personalDashboardReducer, {
		captureItems: [],
	});

	const ctx = useMemo(
		() => ({ state, dispatch, app: plugin.app }),
		[plugin.app],
	);

	const handleOnCapture = ({ text, tag }: { text: string; tag: Tag }) => {
		dispatch({
			type: 'ADD_CAPTURE_ITEM',
			payload: {
				id: crypto.randomUUID(),
				text: text,
				tag: tag,
				time: new Date(Date.now()),
			},
		});
	};

	return (
		<PersonalDashboardContext.Provider value={ctx}>
			<div className="main">
				<AreaView areas={areas} />
				<RightPanel
					items={state.captureItems}
					onCapture={handleOnCapture}
					onFile={() => {}}
					onArchive={() => {}}
					onOpen={() => {}}
				/>
			</div>
		</PersonalDashboardContext.Provider>
	);
}
