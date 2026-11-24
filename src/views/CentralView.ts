import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_CENTRAL = 'relaxed-reviewer-central-view';

export class CentralView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_CENTRAL;
	}

	getDisplayText() {
		return 'Relaxed Reviewer: note';
	}

	async onOpen() {
		this.contentEl.empty();
	}

	async onClose() {}
}
