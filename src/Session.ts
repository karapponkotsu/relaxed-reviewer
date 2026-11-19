import { App } from 'obsidian';
import RelaxedReviewerPlugin from './main.js';
import NotesList from './ui/NotesList.js';
import NoteViewer from './ui/NoteViewer.js';

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

		this.notesList = new NotesList(this.plugin, (index) => {
			this.setCurrentNote(index);
		});

		this.notesList.draw(this.notes);

		this.noteViewer = new NoteViewer(
			this.plugin,
			() => this.setCurrentNote(this.currentNote + 1),
			() => this.setCurrentNote(this.currentNote - 1),
		);
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
}
