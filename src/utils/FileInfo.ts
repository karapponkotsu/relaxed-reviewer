import { App, TFile } from 'obsidian';

type ReviewerFrontmatter = {
	relaxed_reviewer?: number;
	tags?: string[] | string;
	[key: string]: unknown;
};

export default class FileInfo {
	constructor(private app: App) {}

	async setGrade(file: TFile, newGrade: number) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const data = frontmatter as ReviewerFrontmatter;
			data.relaxed_reviewer = newGrade;
		});
	}

	getGrade(file: TFile): number {
		const cache = this.app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter as ReviewerFrontmatter;

		return frontmatter?.relaxed_reviewer ?? -1;
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
}
