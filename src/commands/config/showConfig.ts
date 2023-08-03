import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../../types";
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
		if (!guildConfig) {

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
			)
		});

	}
}

module.exports = command;
