import { App, TFile } from 'obsidian';

type ReviewerFrontmatter = {
	simple_reviewer?: number;
	[key: string]: unknown;
};

export default class FileInfo {
	constructor(private app: App) {}

	async setGrade(file: TFile, newGrade: number) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			const data = frontmatter as ReviewerFrontmatter;
			data.simple_reviewer = newGrade;
		});
	}

	getGrade(file: TFile): number {
		const cache = this.app.metadataCache.getFileCache(file);
		const frontmatter = cache?.frontmatter as ReviewerFrontmatter;

		return frontmatter?.simple_reviewer ?? 0;
	}
}
