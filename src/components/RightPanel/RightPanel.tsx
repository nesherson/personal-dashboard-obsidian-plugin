import { CaptureItem, TAGS } from '@/types/personalDashboardTypes';
import { OnCaptureProps, QuickCapture } from './QuickCapture';
import { Inbox } from './Inbox';
import { PD_CAPTURED_ITEMS_PATH } from '@/constants/paths';
import { usePersonalDashboardContext } from '@/context/personalDashboardContext';
import PersonalDashboardPlugin from '@/main';
import { Notice, TFile } from 'obsidian';

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

	const handleOnCapture = async ({ title, text, tag }: OnCaptureProps) => {
		const path = `${PD_CAPTURED_ITEMS_PATH}/${title}.md`;

		const frontMatterString = `---
tag: ${tag}
---`;
		const mainContent = text;
		const fullFileContent = `${frontMatterString}\n${mainContent}`;

		try {
			const createdFile = await app.vault.create(path, fullFileContent);

			plugin.capturedItemsStore.setItems([
				...plugin.capturedItemsStore.getSnapshot(),
				{
					id: crypto.randomUUID(),
					title: title,
					text: text,
					tag: tag,
					time: createdFile.stat.ctime,
				},
			]);
		} catch (err) {
			if (err instanceof Error) {
				new Notice('An error occured while trying to create note!');
				console.error(err);
			}
		}
	};

	const handleOnOpen = (item: CaptureItem) => {
		const file = app.vault.getAbstractFileByPath(
			`${PD_CAPTURED_ITEMS_PATH}/${item.title}.md`,
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
