import { PluginSettingTab, SettingDefinitionItem } from 'obsidian';
import RelaxedReviewerPlugin from '../../main';

export class MySettingTab extends PluginSettingTab {
	plugin: RelaxedReviewerPlugin;

	constructor(plugin: RelaxedReviewerPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: 'Note title',
				desc: 'Show note title',
				control: {
					type: 'toggle',
					key: 'showTitle',
				},
			},
			{
				name: 'Default Dataview query',
				desc: 'Query to use when no query is provided',
				control: {
					type: 'text',
					key: 'defaultDataviewQuery',
				},
			},
		];
	}
}
