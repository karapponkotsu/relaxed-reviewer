import { Component, MarkdownRenderer, Plugin, TFile } from 'obsidian';
import { CentralView } from './views/CentralView';
import NoteParser from './utils/NoteParser.js';
import { VIEW_TYPE_CENTRAL } from './views/CentralView';
import FileInfo from './utils/FileInfo.js';

export default class NoteViewer {
	private app: Plugin['app'];
	private component: Component | null = null;
	private fileInfo: FileInfo;

	constructor(
		plugin: Plugin,
		private view: CentralView,
		private container: HTMLElement,
		private onNextNote: () => void,
		private onPreviousNote: () => void,
	) {
		this.app = plugin.app;
		this.fileInfo = new FileInfo(this.app);
	}

	async openNote(path: string, noteNumber: number, totalNotes: number) {
		// Clean up the previous rendering.
		this.component?.unload();
		this.component = null;

		this.container.empty();

		const file = this.app.vault.getFileByPath(path);

		if (!file) return;

		const lastModified = file.stat.mtime;
		const daysAgo = Math.floor(
			(Date.now() - lastModified) / (1000 * 60 * 60 * 24),
		);

		/*if (this.plugin.mySettings.showTitle) {
			this.updateTitle(file);
		}*/
		this.updateTitle(file);

		const content = await this.app.vault.read(file);
		const note = NoteParser.parse(content);

		this.container.addClass('markdown-preview-view');

		const questionContainer = this.container.createDiv();
		questionContainer.dataset.sourcePath = file.path;

		const answerContainer = this.container.createDiv();
		answerContainer.dataset.sourcePath = file.path;
		answerContainer.style.display = 'none';

		// Create a new component for this rendering.
		this.component = new Component();
		this.component.load();

		await MarkdownRenderer.render(
			this.app,
			note.question,
			questionContainer,
			file.path,
			this.component,
		);

		if (note.answer !== null) {
			await MarkdownRenderer.render(
				this.app,
				note.answer,
				answerContainer,
				file.path,
				this.component,
			);
		}

		const buttonsContainer = this.container.createDiv({
			cls: 'reviewer-buttons',
		});

		// Previous button
		const previousButton = buttonsContainer.createEl('button', {
			text: 'Previous',
		});

		previousButton.addEventListener('click', () => {
			this.onPreviousNote();
		});

		const gradeButtonsContainer = buttonsContainer.createDiv();

		// Show Answer button (only if an answer exists)
		if (note.answer !== null && note.answer !== '') {
			const button = buttonsContainer.createEl('button', {
				text: 'Show Answer',
			});

			button.addEventListener('click', () => {
				answerContainer.style.display = 'block';
				button.remove();

				this.createGradeButtons(file, gradeButtonsContainer);
			});
		}

		if (note.answer === null || note.answer === '') {
			this.createGradeButtons(file, gradeButtonsContainer);
		}

		// Next button
		const nextButton = buttonsContainer.createEl('button', {
			text: 'Next',
		});

		nextButton.addEventListener('click', () => {
			this.onNextNote();
		});

		const editButton = buttonsContainer.createEl('button', {
			text: 'Edit',
		});

		editButton.addEventListener('click', () => {
			void this.app.workspace.getLeaf(true).openFile(file);
		});

		this.container.createDiv({
			text: `${noteNumber}/${totalNotes} | Last modified ${daysAgo} days ago`,
		});
	}

	private updateTitle(file: TFile) {
		const leafTitle = this.view.containerEl.querySelector('.view-header-title');

		if (leafTitle) {
			leafTitle.textContent = file.basename;
		}

		const tabTitle = document.querySelector(
			`.workspace-tab-header[data-type="${VIEW_TYPE_CENTRAL}"] .workspace-tab-header-inner-title`,
		);

		if (tabTitle) {
			tabTitle.textContent = file.basename;
		}
	}

	private createGradeButtons(file: TFile, container: HTMLElement) {
		// ...
		const grade = this.fileInfo.getGrade(file);

		const buttonsContainer = container;

		for (let i = 0; i <= 7; i++) {
			const button = buttonsContainer.createEl('button', {
				text: String(i),
			});

			if (i === grade) {
				button.addClass('mod-cta');
			}

			button.addEventListener('click', () => {
				void this.fileInfo.setGrade(file, i).then(() => {
					this.onNextNote();
				});
			});
		}
	}
}
