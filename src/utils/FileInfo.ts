import { App, TFile } from 'obsidian';

type ReviewerFrontmatter = {
	relaxed_reviewer?: number;
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

		return frontmatter?.relaxed_reviewer ?? 0;
	}
}
