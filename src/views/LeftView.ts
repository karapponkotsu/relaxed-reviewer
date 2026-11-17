import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_LEFT = 'relaxed-reviewer-left-view';

export class LeftView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_LEFT;
	}

	getDisplayText() {
		return 'Left view';
	}

	async onOpen() {
		this.contentEl.empty();
	}

	async onClose() {}
}
