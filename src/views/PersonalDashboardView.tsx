import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';

import { App } from '../components/App';
import PersonalDashboardPlugin from '@/main';

export const PERSONAL_DASHBOARD_VIEW_TYPE = 'personal-dashboard-view';

export class PersonalDashboardView extends ItemView {
	root: Root | null = null;
	plugin: PersonalDashboardPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: PersonalDashboardPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return PERSONAL_DASHBOARD_VIEW_TYPE;
	}

	getDisplayText(): string {
		return 'Personal Dashboard';
	}

	protected onOpen(): Promise<void> {
		this.root = createRoot(this.containerEl);

		this.root.render(
			<StrictMode>
				<App plugin={this.plugin} />
			</StrictMode>,
		);

		return Promise.resolve();
	}

	protected onClosed(): Promise<void> {
		this.root?.unmount();

		return Promise.resolve();
	}
}
