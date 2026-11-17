import type { DataviewApi } from '@mnaoumov/obsidian-dataview';
import { getAPI } from '@mnaoumov/obsidian-dataview';
import RelaxedReviewerPlugin from '../main';
import { App } from 'obsidian';

type PathableItem = {
	path?: string;
	0?: { path?: string };
	key?: { path?: string };
};

export class DataviewQuery {
	private api: DataviewApi | undefined;

	private plugin: RelaxedReviewerPlugin;
	private app: App;

	constructor(plugin: RelaxedReviewerPlugin) {
		this.plugin = plugin;
		this.app = plugin.app;

		this.api = getAPI(this.app);
	}

	// needed because on Android Dataview loads after some time
	// and constructor might not have been able to get a valid api
	private getApi(): DataviewApi | undefined {
		if (!this.api) {
			this.api = getAPI(this.app);
		}
		return this.api;
	}

	async executeQuery(query: string): Promise<string[]> {
		const api = this.getApi();
		if (!api) {
			return [];
		}

		const result = await api.query(query);

		if (!result.successful) {
			return [];
		}

		return this.extractPaths(result.value.values);
	}

	// Returns an array of notes' paths; works with different kinds of query
	// (LIST, TABLE, WITHOUT ID link(...))
	extractPaths(queryResult: object): string[] {
		const paths: string[] = [];

		if (Array.isArray(queryResult)) {
			for (const el of queryResult) {
				const item = el as PathableItem;
				if (item.path) {
					paths.push(item.path);
				} else if (item[0] && item[0].path) {
					paths.push(item[0].path);
				} else if (item.key && item.key.path) {
					paths.push(item.key.path);
				}
			}
		}

		return paths;
	}
}
