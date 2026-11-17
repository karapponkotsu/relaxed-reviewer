import { SuggestModal } from 'obsidian';
import RelaxedReviewerPlugin from '../main';

export type SearchMode = 'dataview' | 'omnisearch';

export class SearchModal extends SuggestModal<string> {
	private plugin: RelaxedReviewerPlugin;

	constructor(
		plugin: RelaxedReviewerPlugin,
		private mode: SearchMode,
		private onSubmit: (query: string, mode: SearchMode) => void | Promise<void>,
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.setPlaceholder(this.getPlaceholder());
	}

	private getPlaceholder(): string {
		switch (this.mode) {
			case 'dataview':
				return 'Enter a query...';
			case 'omnisearch':
				return 'Enter a keyword...';
			default:
				return 'Enter a search string...';
		}
	}

	/*getSuggestions(search: string): string[] {
		if (this.mode === 'dataview') {
			return search ? [search] : this.plugin.mySettings.dataviewSuggestions;
		} else if (this.mode === 'omnisearch') {
			return search ? [search] : this.plugin.mySettings.omnisearchSuggestions;
		} else {
			return search ? [search] : [];
		}
	}*/

	getSuggestions(search: string): string[] {
		return search ? [search] : [];
	}

	renderSuggestion(value: string, el: HTMLElement) {
		el.setText(value);
	}

	onChooseSuggestion(value: string) {
		void this.onSubmit(value, this.mode);
	}
}
