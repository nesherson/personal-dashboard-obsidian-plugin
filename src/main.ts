import { Notice, Plugin, TFile, TFolder, WorkspaceLeaf } from 'obsidian';

import {
	PERSONAL_DASHBOARD_VIEW_TYPE,
	PersonalDashboardView,
} from './views/PersonalDashboardView';
import {
	Area,
	CaptureItem,
	DEFAULT_TAG,
	isTag,
} from './types/personalDashboardTypes';
import { AreaStore } from './store/areaStore';
import { CapturedItemsStore } from './store/capturedItemsStore';
import { getRelativeTimeString } from './utils/time';
import {
	cleanSettings,
	DEFAULT_SETTINGS,
	PersonalDashboardSettings,
	PersonalDashboardSettingTab,
} from './settings';

export interface FolderChange {
	key: keyof PersonalDashboardSettings;
	oldName: string;
}

export default class PersonalDashboardPlugin extends Plugin {
	settings: PersonalDashboardSettings = { ...DEFAULT_SETTINGS };
	areaStore = new AreaStore();
	capturedItemsStore = new CapturedItemsStore();

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new PersonalDashboardSettingTab(this.app, this));

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

		this.app.workspace.onLayoutReady(() => {
			void this.applyFolderSettings();
		});

		this.registerEvent(
			this.app.vault.on('create', (file) => {
				if (this.inAreasFolder(file.path)) {
					this.syncAreasFromFolder();
				}
			}),
		);
		this.registerEvent(
			this.app.vault.on('rename', async (file, oldPath) => {
				if (
					this.inAreasFolder(file.path) ||
					this.inAreasFolder(oldPath)
				) {
					this.syncAreasFromFolder();
				}

				if (
					this.inCapturedItemsFolder(file.path) ||
					this.inCapturedItemsFolder(oldPath)
				) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('modify', async (file) => {
				if (this.inAreasFolder(file.path)) {
					this.syncAreasFromFolder();
				}

				if (this.inCapturedItemsFolder(file.path)) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.vault.on('delete', async (file) => {
				if (this.inAreasFolder(file.path)) {
					this.syncAreasFromFolder();
				}

				if (this.inCapturedItemsFolder(file.path)) {
					await this.syncCapturedItemsFromFolder();
				}
			}),
		);

		this.registerEvent(
			this.app.metadataCache.on('changed', (file) => {
				if (this.inAreasFolder(file.path)) {
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

	async loadSettings() {
		this.settings = cleanSettings(
			(await this.loadData()) as Partial<PersonalDashboardSettings> | null,
		);
	}

	get areasPath() {
		return `${this.settings.baseFolder}/${this.settings.areasFolder}`;
	}

	get capturedItemsPath() {
		return `${this.settings.baseFolder}/${this.settings.capturedItemsFolder}`;
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async applyFolderSettings(change?: FolderChange) {
		if (change) await this.renameConfiguredFolder(change);

		await this.ensureFolder(this.settings.baseFolder);
		await this.ensureFolder(this.areasPath);
		await this.ensureFolder(this.capturedItemsPath);

		this.syncAreasFromFolder();
		await this.syncCapturedItemsFromFolder();
	}

	private async renameConfiguredFolder({ key, oldName }: FolderChange) {
		const newName = this.settings[key];
		if (oldName === newName) return;

		const [oldPath, newPath] =
			key === 'baseFolder'
				? [oldName, newName]
				: [
						`${this.settings.baseFolder}/${oldName}`,
						`${this.settings.baseFolder}/${newName}`,
					];

		const oldFolder = this.app.vault.getAbstractFileByPath(oldPath);
		if (!(oldFolder instanceof TFolder)) return;

		if (this.app.vault.getAbstractFileByPath(newPath) !== null) {
			new Notice(
				`"${newPath}" already exists, so "${oldPath}" was left in place.`,
			);
			return;
		}

		try {
			await this.app.fileManager.renameFile(oldFolder, newPath);
		} catch (err) {
			new Notice(`Couldn't rename "${oldPath}" to "${newPath}".`);
			console.error(err);
		}
	}

	private async ensureFolder(path: string) {
		if (this.app.vault.getAbstractFileByPath(path) === null) {
			await this.app.vault.createFolder(path);
		}
	}

	private inAreasFolder(path: string) {
		return path.startsWith(this.areasPath + '/');
	}

	private inCapturedItemsFolder(path: string) {
		return path.startsWith(this.capturedItemsPath + '/');
	}

	syncAreasFromFolder() {
		const folder = this.app.vault.getAbstractFileByPath(this.areasPath);
		if (!(folder instanceof TFolder)) {
			this.areaStore.setAreas([]);
			return;
		}

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
			this.capturedItemsPath,
		);
		if (!(folder instanceof TFolder)) {
			this.capturedItemsStore.setItems([]);
			return;
		}

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
				tag: isTag(frontmatter?.tag) ? frontmatter.tag : DEFAULT_TAG,
				text: text,
				time: file.stat.ctime,
			});
		}

		this.capturedItemsStore.setItems(capturedItems);
	}
}
