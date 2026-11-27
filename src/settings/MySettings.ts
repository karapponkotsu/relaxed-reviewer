export interface MySettings {
	showTitle: boolean;
	flipNote: boolean;
	maxGrade: string;
	frontmatterName: string;
	defaultDataviewQuery: string;
}

export const DEFAULT_MYSETTINGS: MySettings = {
	showTitle: true,
	flipNote: false,
	maxGrade: '7',
	frontmatterName: 'relaxed_reviewer',
	defaultDataviewQuery: 'LIST',
};
