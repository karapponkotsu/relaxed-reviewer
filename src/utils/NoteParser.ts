export type ParsedNote = {
	question: string;
	answer: string | null;
};

export default class NoteParser {
	static parse(content: string): ParsedNote {
		const parts = content.split(/%%\?\?%%/);

		return {
			question: parts[0] ?? '',
			answer: parts.length > 1 ? (parts[1] ?? '') : null,
		};
	}
}
