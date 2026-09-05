import { Notice, Plugin } from 'obsidian';

export default class PersonalDashboardPlugin extends Plugin {
	async onload() {
		this.addRibbonIcon('dice', 'Sample', (_evt: MouseEvent) => {
			new Notice('This is a notice!');
		});
	}

	onunload() {}
}
