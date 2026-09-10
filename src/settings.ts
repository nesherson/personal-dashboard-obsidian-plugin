import { App, PluginSettingTab, Setting } from 'obsidian';

import PersonalDashboardPlugin from './main';

export interface PersonalDashboardSettings {
	baseFolder: string;
	areasFolder: string;
	capturedItemsFolder: string;
}

export const DEFAULT_SETTINGS: PersonalDashboardSettings = {
	baseFolder: 'Personal Dashboard',
	areasFolder: 'Areas',
	capturedItemsFolder: 'Quick captures',
};

export function cleanFolderName(value: string, fallback: string): string {
	const last = value
		.split(/[\\/]+/)
		.map((s) => s.trim())
		.filter(Boolean)
		.pop();
	return last ?? fallback;
}

export function cleanSettings(
	raw: Partial<PersonalDashboardSettings> | null | undefined,
): PersonalDashboardSettings {
	const out = { ...DEFAULT_SETTINGS };
	for (const key of Object.keys(
		DEFAULT_SETTINGS,
	) as (keyof PersonalDashboardSettings)[]) {
		const v = raw?.[key];
		if (typeof v === 'string') {
			out[key] = cleanFolderName(v, DEFAULT_SETTINGS[key]);
		}
	}
	return out;
}

export class PersonalDashboardSettingTab extends PluginSettingTab {
	plugin: PersonalDashboardPlugin;

	constructor(app: App, plugin: PersonalDashboardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		this.addFolderSetting({
			name: 'Base folder',
			desc: 'Top-level folder in your vault that holds everything the dashboard uses.',
			key: 'baseFolder',
		});

		this.addFolderSetting({
			name: 'Areas folder',
			desc: 'Sub-folder of the base folder. Each note in it becomes a tile.',
			key: 'areasFolder',
		});

		this.addFolderSetting({
			name: 'Quick captures folder',
			desc: 'Sub-folder of the base folder. Captures are saved here as notes and shown in the inbox.',
			key: 'capturedItemsFolder',
		});
	}

	private addFolderSetting({
		name,
		desc,
		key,
	}: {
		name: string;
		desc: string;
		key: keyof PersonalDashboardSettings;
	}) {
		new Setting(this.containerEl)
			.setName(name)
			.setDesc(
				`${desc} Folder name only, no path. Created if it doesn't exist.`,
			)
			.addText((text) => {
				text.setPlaceholder(DEFAULT_SETTINGS[key]).setValue(
					this.plugin.settings[key],
				);

				let oldName = this.plugin.settings[key];
				text.inputEl.addEventListener('focus', () => {
					oldName = this.plugin.settings[key];
				});

				text.onChange(async (value) => {
					this.plugin.settings[key] = cleanFolderName(
						value,
						DEFAULT_SETTINGS[key],
					);
					await this.plugin.saveSettings();
				});

				const apply = () => {
					text.setValue(this.plugin.settings[key]);
					void this.plugin.applyFolderSettings({ key, oldName });
				};
				text.inputEl.addEventListener('blur', apply);
				text.inputEl.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') text.inputEl.blur();
				});
			});
	}
}
