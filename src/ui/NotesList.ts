import { App } from 'obsidian';
import { LeftView, VIEW_TYPE_LEFT } from '../views/LeftView';
import RelaxedReviewerPlugin from '../main';

export default class NotesList {
	private plugin: RelaxedReviewerPlugin;
	private app: App;
	private selectedElement: HTMLElement | null = null;

	constructor(
		plugin: RelaxedReviewerPlugin,
		private onNoteClick: (index: number) => void,
	) {
		this.plugin = plugin;
		this.app = plugin.app;
	}

	draw(notes: string[]) {
		const view = this.getLeftView();
		if (view) {
			const contentEl = view.contentEl;
			contentEl.addClass('notes-list-content');
			contentEl.empty();
			this.selectedElement = null;

			notes.forEach((note, index) => {
				const item = contentEl.createDiv({
					text: note,
					cls: 'note-item',
				});

				item.addEventListener('click', () => {
					this.onNoteClick(index);
				});
			});
		}
	}

	select(index: number) {
		this.selectedElement?.removeClass('selected');

		const view = this.getLeftView();
		if (view) {
			const contentEl = view.contentEl;
			const element = contentEl.children[index] as HTMLElement | undefined;

			if (element) {
				element.addClass('selected');
				this.selectedElement = element;
			} else {
				this.selectedElement = null;
			}
		}
	}

	getLeftView(): LeftView | null {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_LEFT);
		return leaves[0]?.view instanceof LeftView ? leaves[0].view : null;
	}
}
