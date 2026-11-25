import { Plugin, WorkspaceLeaf } from 'obsidian';
import { CentralView, VIEW_TYPE_CENTRAL } from './views/CentralView';
import { LeftView, VIEW_TYPE_LEFT } from './views/LeftView';
import Session from './Session';
import { SearchModal } from './modals/SearchModal';
import { DataviewQuery } from './utils/DataviewQuery';
import { MySettings, DEFAULT_MYSETTINGS } from './settings/MySettings';
import { MySettingTab } from './settings/ui/MySettingTab';

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
	settings: MySettings = DEFAULT_MYSETTINGS;

	dataviewQuery: DataviewQuery | null = null;
	session: Session | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new MySettingTab(this));

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
			callback: async () => {
				await this.activateLeftView();
				const modal = new SearchModal(this, 'dataview', async (query, mode) => {
					const finalQuery = query.trim() || this.settings.defaultDataviewQuery;

					if (!finalQuery) {
						return;
					}

					const queryResult =
						await this.dataviewQuery?.executeQuery(finalQuery);
					if (queryResult && queryResult.length > 0 && this.session) {
						void this.session.init(queryResult);
					}
				});

				modal.open();
			},
		});

		this.addCommand({
			id: 'show-search-modal',
			name: 'Omnisearch search',
			callback: async () => {
				await this.activateLeftView();
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

	async loadSettings() {
		const data = (await this.loadData()) as Partial<MySettings>;

		this.settings = Object.assign({}, DEFAULT_MYSETTINGS, data);
	}

	async saveSettings() {
		await this.saveData(this.settings);
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
}
