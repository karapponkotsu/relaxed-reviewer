import { Plugin } from 'obsidian';
import { CentralView, VIEW_TYPE_CENTRAL } from './views/CentralView';
import { LeftView, VIEW_TYPE_LEFT } from './views/LeftView';
import Session from './Session';
import { SearchModal } from './modals/SearchModal';
import { DataviewQuery } from './utils/DataviewQuery';

export type OmnisearchResult = {
	path: string;
};

export type OmnisearchPlugin = {
	search: (query: string) => Promise<OmnisearchResult[]>;
};

declare global {
	interface Window {
		omnisearch?: OmnisearchPlugin;
	}
}

export default class RelaxedReviewerPlugin extends Plugin {
	dataviewQuery: DataviewQuery | null = null;
	session: Session | null = null;

	async onload() {
		this.registerView(VIEW_TYPE_CENTRAL, (leaf) => new CentralView(leaf));
		this.registerView(VIEW_TYPE_LEFT, (leaf) => new LeftView(leaf));

		this.dataviewQuery = new DataviewQuery(this);
		this.session = new Session(this);

		this.addCommand({
			id: 'reset-session-modal',
			name: 'Reset session',
			callback: () => {
				void this.session?.init([]);
			},
		});

		this.addCommand({
			id: 'show-query-modal',
			name: 'Dataview query',
			callback: () => {
				const modal = new SearchModal(this, 'dataview', async (query, mode) => {
					const queryResult = await this.dataviewQuery?.executeQuery(query);
					if (queryResult && queryResult.length > 0 && this.session) {
						void this.session.init(queryResult);
					}
				});

				modal.open();
			},
		});

		this.addCommand({
			id: 'show-search-modal',
			name: 'Omnisearch query',
			callback: () => {
				const modal = new SearchModal(this, 'omnisearch', async (keyword) => {
					const omnisearch = window.omnisearch;

					if (!omnisearch) {
						return;
					}

					const searchResult = await omnisearch.search(keyword);

					const searchPaths = searchResult.map((result) => result.path);

					if (searchPaths.length > 0 && this.session) {
						await this.session.init(searchPaths);
					}
				});

				modal.open();
			},
		});
	}

	onunload() {}
}
