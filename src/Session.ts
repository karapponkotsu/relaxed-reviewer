import { App, WorkspaceLeaf } from 'obsidian';
import RelaxedReviewerPlugin from './main.js';
import { CentralView, VIEW_TYPE_CENTRAL } from './views/CentralView.js';
import { LeftView, VIEW_TYPE_LEFT } from './views/LeftView.js';
import NotesList from './NotesList.js';
import NoteViewer from './NoteViewer.js';

export default class Session {
	private plugin: RelaxedReviewerPlugin;
	private app: App;

	private currentNote = 0;
	private notes: string[] = [];

	private notesList: NotesList | null = null;
	private noteViewer: NoteViewer | null = null;

	constructor(plugin: RelaxedReviewerPlugin) {
		this.plugin = plugin;
		this.app = plugin.app;
	}

	async init(queryResult: string[]) {
		if (this.notes.length < 1) {
			this.notes = queryResult;
		} else {
			this.notes = this.notes.filter((item) => queryResult.includes(item));
		}

		await this.activateLeftView();
		await this.activateCentralView();

		const leftView = this.getLeftView();

		if (leftView) {
			const container = leftView.contentEl;

			this.notesList = new NotesList(container, (index) => {
				this.setCurrentNote(index);
			});

			this.notesList.draw(this.notes);
		}

		const centralView = this.getCentralView();

		if (centralView) {
			this.noteViewer = new NoteViewer(
				this.plugin,
				centralView,
				centralView.contentEl,
				() => this.setCurrentNote(this.currentNote + 1),
				() => this.setCurrentNote(this.currentNote - 1),
			);
		}
	}

	setCurrentNote(index: number) {
		const note = this.notes[index];

		if (note === undefined) {
			return;
		}

		this.currentNote = index;

		this.notesList?.select(index);

		void this.noteViewer?.openNote(
			note,
			this.currentNote + 1,
			this.notes.length,
		);
	}

	async activateCentralView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | undefined =
			workspace.getLeavesOfType(VIEW_TYPE_CENTRAL)[0];

		if (!leaf) {
			leaf = workspace.getLeaf(true);
			await leaf.setViewState({ type: VIEW_TYPE_CENTRAL, active: true });
		}

		await workspace.revealLeaf(leaf);
	}

	async activateLeftView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null | undefined =
			workspace.getLeavesOfType(VIEW_TYPE_LEFT)[0];

		if (!leaf) {
			leaf = workspace.getLeftLeaf(false);

			if (!leaf) {
				return;
			}

			await leaf.setViewState({ type: VIEW_TYPE_LEFT, active: true });
		}

		await workspace.revealLeaf(leaf);
	}

	getCentralView(): CentralView | null {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_CENTRAL);
		return leaves[0]?.view instanceof CentralView ? leaves[0].view : null;
	}

	getLeftView(): LeftView | null {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_LEFT);
		return leaves[0]?.view instanceof LeftView ? leaves[0].view : null;
	}
}
