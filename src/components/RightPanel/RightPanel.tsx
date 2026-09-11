import { CaptureItem, TAGS } from '@/types/personalDashboardTypes';
import { CaptureNoteProps, QuickCapture } from './QuickCapture';
import { Inbox } from './Inbox';
import { usePersonalDashboardContext } from '@/context/personalDashboardContext';
import PersonalDashboardPlugin from '@/main';
import { TFile } from 'obsidian';

interface RightPanelProps {
	items: CaptureItem[];
	title?: string;
	plugin: PersonalDashboardPlugin;
}

export function RightPanel({
	items = [],
	title = 'Capture',
	plugin,
}: RightPanelProps) {
	const { app } = usePersonalDashboardContext();

	const handleOnCapture = async ({
		title,
		text,
		tag,
	}: CaptureNoteProps) => {
		await plugin.captureNote({ title: title, text: text, tag: tag });
	};

	const handleOnOpen = (item: CaptureItem) => {
		const file = app.vault.getAbstractFileByPath(
			`${plugin.capturedItemsPath}/${item.title}.md`,
		);

		if (!(file instanceof TFile)) return;

		void app.workspace.getLeaf(false).openFile(file);
	};

	return (
		<div
			className="pd-right-panel"
			style={{ containerType: 'inline-size' }}
		>
			<div className="pd-panel__header">
				<span>{title}</span>
			</div>
			<QuickCapture
				onCapture={handleOnCapture}
				tags={TAGS}
				defaultTag="Note"
			/>
			<div className="pd-inbox__header">
				<span>Inbox</span>
				<span className="pd-inbox__count">
					{items.length} {items.length === 1 ? 'item' : 'items'}
				</span>
			</div>
			<Inbox items={items} onOpen={handleOnOpen} />
		</div>
	);
}
