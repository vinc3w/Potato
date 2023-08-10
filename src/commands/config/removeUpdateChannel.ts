import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../../types";
import { getGuildConfig, setGuildConfig } from "../../db/collections/guildConfig";
import { getEmbed, yesNoBtns } from "../../utils/message";

const data = new SlashCommandBuilder()
	.setName("remove-update-channel")
	.setDescription("Remove the text channel to receive updates of instagram artists.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

const command: BotCommand = {
	data,
	async execute(interaction: ChatInputCommandInteraction) {
		
		if (!interaction.guildId) return; 
		const updateChannelId = getGuildConfig(interaction.guildId)?.updateChannelId;
		if (!updateChannelId) {

			interaction.reply({
				embeds: getEmbed(
					"ERROR",
					"This guild does not have an update channel set!"
				),
				ephemeral: true
			})
			return;

		}

		const buttonResponse = await interaction.reply({
			embeds: getEmbed(
				"WARNING",
				`Remove <#${updateChannelId}> as update channel?`
			),
			components: [yesNoBtns()],
			ephemeral: true
		});
		const confirmation = await buttonResponse.awaitMessageComponent({
			filter: i => i.user.id === interaction.user.id,
			time: 30000
		});

		if (confirmation.customId === "no") {
				
			buttonResponse.edit({
				embeds: getEmbed(
					"SUCCESS",
					`Removal terminated 👌. Update channel is still <#${updateChannelId}>`
				),
				components: []
			});
			return;

		}

		buttonResponse.edit({
			embeds: getEmbed(
				"INFO",
				"Removing update channel"
			),
			components: []
		});
		setGuildConfig(
			interaction.guildId,
			{ key: "updateChannelId", value: undefined }
		);
		buttonResponse.edit({
			embeds: getEmbed(
				"SUCCESS",
				`Removed update channel. Kampai! 🍺.`
			)
		});

	}
}

module.exports = command;
