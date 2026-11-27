export interface MySettings {
	showTitle: boolean;
	flipNote: boolean;
	defaultDataviewQuery: string;
}

export const DEFAULT_MYSETTINGS: MySettings = {
	showTitle: true,
	flipNote: false,
	defaultDataviewQuery: 'LIST',
};
