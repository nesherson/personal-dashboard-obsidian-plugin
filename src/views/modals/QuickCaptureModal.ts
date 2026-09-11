import PersonalDashboardPlugin from '@/main';
import { DEFAULT_TAG, Tag, TAGS } from '@/types/personalDashboardTypes';
import { ButtonComponent, Modal, Notice, Setting } from 'obsidian';

export class QuickCaptureModal extends Modal {
	plugin: PersonalDashboardPlugin;

	private title = '';
	private noteText = '';
	private selectedTag: Tag = DEFAULT_TAG;
	private submitting = false;

	constructor(plugin: PersonalDashboardPlugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.setTitle('Quick capture');
	}

	onOpen() {
		this.title = '';
		this.noteText = '';
		this.selectedTag = DEFAULT_TAG;
		this.submitting = false;

		const { contentEl } = this;

		const submitOnModEnter = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				void this.submit();
			}
		};

		new Setting(contentEl)
			.setClass('pd-quick-capture-modal-input')
			.addText((text) => {
				text.setPlaceholder('Note title').onChange((value) => {
					this.title = value;
				});
				text.inputEl.addEventListener('keydown', submitOnModEnter);
			});

		new Setting(contentEl)
			.setClass('pd-quick-capture-modal-input')
			.addTextArea((textArea) => {
				textArea.setPlaceholder('Note details').onChange((value) => {
					this.noteText = value;
				});
				textArea.inputEl.addEventListener(
					'keydown',
					submitOnModEnter,
				);
			});

		const buttonGroupEl = contentEl.createDiv({
			cls: 'pd-quick-capture-modal-button-group',
		});

		for (const tag of TAGS) {
			const btn = new ButtonComponent(buttonGroupEl)
				.setButtonText(tag)
				.setClass('pd-tag')
				.onClick(() => {
					this.selectedTag = tag;
					buttonGroupEl
						.querySelectorAll('button')
						.forEach((b) => b.classList.remove('is-active'));
					btn.buttonEl.classList.add('is-active');
				});

			if (tag === this.selectedTag)
				btn.buttonEl.classList.add('is-active');
		}

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText('Capture')
				.setCta()
				.onClick(() => void this.submit()),
		);
	}

	onClose() {
		this.contentEl.empty();
	}

	private async submit() {
		if (this.submitting) return;

		const title = this.title.trim();
		if (!title) {
			new Notice('Give the note a title first.');
			return;
		}

		this.submitting = true;
		try {
			await this.plugin.captureNote({
				title,
				text: this.noteText,
				tag: this.selectedTag,
			});
			this.close();
		} catch (err) {
			new Notice('An error occurred while trying to create the note.');
			console.error(err);
		} finally {
			this.submitting = false;
		}
	}
}
