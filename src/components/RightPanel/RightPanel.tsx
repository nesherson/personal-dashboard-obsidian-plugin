import { CaptureItem, Tag, TAGS } from '@/types/personalDashboardTypes';
import { QuickCapture } from './QuickCapture';
import { Inbox } from './Inbox';
import { PD_CAPTURE_ITEMS_PATH } from '@/constants/paths';
import { usePersonalDashboardContext } from '@/context/personalDashboardContext';
import PersonalDashboardPlugin from '@/main';
import { Notice } from 'obsidian';

interface RightPanelProps {
	items: CaptureItem[];
	onFile: () => void;
	onArchive: () => void;
	onOpen: () => void;
	title?: string;
	plugin: PersonalDashboardPlugin;
}

export function RightPanel({
	items = [],
	onFile,
	onArchive,
	onOpen,
	title = 'Capture',
	plugin
}: RightPanelProps) {
	const { app } = usePersonalDashboardContext();

	const handleOnCapture = async ({ text, tag }: { text: string; tag: Tag }) => {
		const path = `${PD_CAPTURE_ITEMS_PATH}/${text}.md`;

		const frontMatterString =
`---
tag: ${tag}
---`;
		const mainContent = '';
		const fullFileContent = `${frontMatterString}\n\n${mainContent}`;

		try {
			const createdFile = await app.vault.create(path, fullFileContent);

			plugin.capturedItemsStore.setItems([
				...plugin.capturedItemsStore.getSnapshot(),
				{
					id: crypto.randomUUID(),
					text: text,
					tag: tag,
					time: createdFile.stat.ctime
				}
			])
		}
		catch (err) {
			if (err instanceof Error) {
				new Notice('An error occured while trying to create note!');
				console.error(err)
			}
		}
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
			<Inbox
				items={items}
				onFile={onFile}
				onArchive={onArchive}
				onOpen={onOpen}
			/>
		</div>
	);
}
