export interface MySettings {
	showTitle: boolean;
	defaultDataviewQuery: string;
}

export const DEFAULT_MYSETTINGS: MySettings = {
	showTitle: true,
	defaultDataviewQuery:
		'LIST file.name WHERE ((relaxed_reviewer = 0 OR !relaxed_reviewer) AND file.mtime <= date(today) - dur(1 day)) OR (relaxed_reviewer = 1 AND file.mtime <= date(today) - dur(3 days)) OR (relaxed_reviewer = 2 AND file.mtime <= date(today) - dur(8 days)) OR (relaxed_reviewer = 3 AND file.mtime <= date(today) - dur(20 days)) OR (relaxed_reviewer = 4 AND file.mtime <= date(today) - dur(45 days)) OR (relaxed_reviewer = 5 AND file.mtime <= date(today) - dur(90 days)) OR (relaxed_reviewer = 6 AND file.mtime <= date(today) - dur(180 days)) OR (relaxed_reviewer = 7 AND file.mtime <= date(today) - dur(365 days))SORT file.mtime ASC, relaxed_reviewer ASC',
};
