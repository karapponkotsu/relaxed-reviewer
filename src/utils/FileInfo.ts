import { App, TFile } from 'obsidian';
import RelaxedReviewerPlugin from '../main';

type ReviewerFrontmatter = {
	//relaxed_reviewer?: number;
	tags?: string[] | string;
	[key: string]: unknown;
};

export default class FileInfo {
	private plugin: RelaxedReviewerPlugin;
	private app: App;

	constructor(plugin: RelaxedReviewerPlugin) {
		this.plugin = plugin;
		this.app = plugin.app;
	}

	async setGrade(file: TFile, newGrade: number) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const data = frontmatter as ReviewerFrontmatter;
			data[this.plugin.settings.frontmatterName + '_grade'] = newGrade;
		});
	}

	getGrade(file: TFile): number {
		const cache = this.app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter as ReviewerFrontmatter;

		const grade =
			frontmatter?.[this.plugin.settings.frontmatterName + '_grade'];

		return typeof grade === 'number' ? grade : -1;
	}

	hasTag(file: TFile, tag: string): boolean {
		const cache = this.app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter as ReviewerFrontmatter;
		const tags = frontmatter?.tags;

		if (Array.isArray(tags)) {
			return tags.includes(tag);
		}

		if (typeof tags === 'string') {
			return tags.split(/\s+/).includes(tag);
		}

		return false;
	}

	async toggleTag(file: TFile, tag: string): Promise<void> {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const data = frontmatter as ReviewerFrontmatter;
			const currentTags = data.tags;

			const tags = Array.isArray(currentTags)
				? currentTags
				: typeof currentTags === 'string'
					? currentTags.split(/\s+/).filter(Boolean)
					: [];

			data.tags = tags.includes(tag)
				? tags.filter((t) => t !== tag)
				: [...tags, tag];
		});
	}

	async setSessionId(file: TFile, sessionId: string | null) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const data = frontmatter as ReviewerFrontmatter;

			if (sessionId === null) {
				//delete data.relaxed_reviewer_session;
				delete data[this.plugin.settings.frontmatterName + '_session'];
			} else {
				//data.relaxed_reviewer_session = sessionId;
				data[this.plugin.settings.frontmatterName + '_session'] = sessionId;
			}
		});
	}
}
