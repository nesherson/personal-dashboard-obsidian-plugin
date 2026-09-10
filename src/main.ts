import { Plugin, TFile, TFolder, WorkspaceLeaf } from 'obsidian';

import {
	PERSONAL_DASHBOARD_VIEW_TYPE,
	PersonalDashboardView,
} from './views/PersonalDashboardView';
import { Area, CaptureItem, Tag } from './types/personalDashboardTypes';
import { AreaStore } from './store/areaStore';
import { CapturedItemsStore } from './store/capturedItemsStore';
import { getRelativeTimeString } from './utils/time';
import { PD_AREAS_PATH, PD_CAPTURED_ITEMS_PATH } from './constants/paths';

export default class PersonalDashboardPlugin extends Plugin {
	areaStore = new AreaStore();
	capturedItemsStore = new CapturedItemsStore();

	async onload() {
		this.registerView(
			PERSONAL_DASHBOARD_VIEW_TYPE,
			(leaf) => new PersonalDashboardView(leaf, this),
		);

		this.addRibbonIcon(
			'layout-dashboard',
			'Personal dashboard',
			(_evt: MouseEvent) => {
				void this.activateView();
			},
		);

		this.addCommand({
			id: 'open',
			name: 'Open',
			callback: async () => {
				await this.activateView();
			},
		});

		this.app.workspace.onLayoutReady(async () => {
			this.syncAreasFromFolder();
			await this.syncCapturedItemsFromFolder();
		});

		this.registerEvent(
			this.app.vault.on('create', (file) => {
				if (file.path.contains(PD_AREAS_PATH)) {
					this.syncAreasFromFolder();
				}
			}),
		);
		this.registerEvent(
			this.app.vault.on('rename', async (file) => {
				if (file.path.contains(PD_AREAS_PATH)) {
					this.syncAreasFromFolder();
				}

				if (file.path.contains(PD_CAPTURED_ITEMS_PATH)) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', async (file) => {
				if (file.path.contains(PD_AREAS_PATH)) {
					this.syncAreasFromFolder();
				}

				if (file.path.contains(PD_CAPTURED_ITEMS_PATH)) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('delete', async (file) => {
				if (file.path.contains(PD_AREAS_PATH)) {
					this.syncAreasFromFolder();
				}

				if (file.path.contains(PD_CAPTURED_ITEMS_PATH)) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.metadataCache.on('changed', (file) => {
				if (file.path.contains(PD_AREAS_PATH)) {
					this.syncAreasFromFolder();
				}
			}),
		);
	}

	onunload() {}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | undefined = undefined;
		const leaves = workspace.getLeavesOfType(
			PERSONAL_DASHBOARD_VIEW_TYPE,
		);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getLeaf(true);
			await leaf.setViewState({
				type: PERSONAL_DASHBOARD_VIEW_TYPE,
				active: true,
			});
		}

		if (leaf) {
			await workspace.revealLeaf(leaf);
		}
	}

	syncAreasFromFolder() {
		const folder = this.app.vault.getAbstractFileByPath(PD_AREAS_PATH);
		if (!(folder instanceof TFolder)) return;

		const areas: Area[] = [];

		for (const file of folder.children) {
			if (!(file instanceof TFile)) continue;

			const frontmatter =
				this.app.metadataCache.getFileCache(file)?.frontmatter;

			areas.push({
				id: file.basename,
				title: file.basename,
				href: `obsidian://open?file=${file.basename}`,
				preview: (frontmatter?.description as string) ?? '',
				meta: `Edited - ${getRelativeTimeString(file.stat.mtime)}`,
				icon: frontmatter?.icon as string,
			});
		}

		this.areaStore.setAreas(areas);
	}

	async syncCapturedItemsFromFolder() {
		const folder = this.app.vault.getAbstractFileByPath(
			PD_CAPTURED_ITEMS_PATH,
		);
		if (!(folder instanceof TFolder)) return;

		const capturedItems: CaptureItem[] = [];

		for (const file of folder.children) {
			if (!(file instanceof TFile)) continue;

			const frontmatter =
				this.app.metadataCache.getFileCache(file)?.frontmatter;

			const fileText = await this.app.vault.read(file);
			const frontMatterEndLineIdx = fileText.indexOf('---', 4);
			const text = fileText.slice(frontMatterEndLineIdx + 3);

			capturedItems.push({
				id: crypto.randomUUID(),
				title: file.basename,
				tag: frontmatter?.tag as Tag,
				text: text,
				time: file.stat.ctime,
			});
		}

		this.capturedItemsStore.setItems(capturedItems);
	}
}
