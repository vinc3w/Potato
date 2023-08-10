import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BotCommand, GuildConfig } from "../../types";
import { getGuildConfig } from "../../db/collections/guildConfig";
import { getEmbed } from "../../utils/message";

const data = new SlashCommandBuilder()
	.setName("show-config")
	.setDescription("Show the bot's configuration of this guild.")
	.setDMPermission(false);

const command: BotCommand = {
	data,
	execute(interaction: ChatInputCommandInteraction) {

		if (!interaction.guildId) return; 
		const guildConfig = getGuildConfig(interaction.guildId);

		let definedProperty: string[] = [];
		for (const config in guildConfig) 
			if (config !== "id") 
				guildConfig[config as keyof GuildConfig] && definedProperty.push(config);

		if (!guildConfig || !definedProperty.length) {

			interaction.reply({
				embeds: getEmbed(
					"ERROR",
					"This guild does not have any configuration set! 😖"
				),
				ephemeral: true
			})
			return;

		}
		
		interaction.reply({
			embeds: getEmbed(
				"INFO",
				`**Guild Id:** \`${guildConfig.id}\`
				\n**Update Channel:** <#${guildConfig.updateChannelId}>`
			),
			ephemeral: true
		});

	}
}

module.exports = command;
