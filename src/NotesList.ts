export default class NotesList {
	private selectedElement: HTMLElement | null = null;

	constructor(
		private container: HTMLElement,
		private onNoteClick: (index: number) => void,
	) {}

	draw(notes: string[]) {
		this.container.empty();
		this.selectedElement = null;

		notes.forEach((note, index) => {
			const item = this.container.createDiv({
				text: note,
				cls: 'note-item',
			});

			item.addEventListener('click', () => {
				this.onNoteClick(index);
			});
		});
	}

	select(index: number) {
		this.selectedElement?.removeClass('selected');

		const element = this.container.children[index] as HTMLElement | undefined;

		if (element) {
			element.addClass('selected');
			this.selectedElement = element;
		} else {
			this.selectedElement = null;
		}
	}

	/*	private selectElement(element: HTMLElement) {
		this.selectedElement?.removeClass('selected');

		element.addClass('selected');
		this.selectedElement = element;
	}*/
}
