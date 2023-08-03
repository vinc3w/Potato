import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits } from "discord.js";
import { BotCommand } from "../../types";
import { getGuildConfig, setGuildConfig } from "../../db/collections/guildConfig";
import { getEmbed, yesNoBtns } from "../../utils/message";

const data = new SlashCommandBuilder()
	.setName("set-update-channel")
	.setDescription("Set the text channel to receive updates of instagram artists.")
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false)
	.addChannelOption(
		option => option
			.setName("text-channel")
			.setDescription("text channel to be set to receives updates")
			.setRequired(true)
	) as SlashCommandBuilder;

const command: BotCommand = {
	data,
	async execute(interaction: ChatInputCommandInteraction) {
	
		if (!interaction.guildId) return; 
		const currentUpdateChannelId = getGuildConfig(interaction.guildId)?.updateChannelId;
		const textChannel = interaction.options.getChannel("text-channel", true, [ChannelType.GuildText]);
		if (currentUpdateChannelId === textChannel.id) {

			interaction.reply({
				embeds: getEmbed(
					"ERROR",
					`Update channel is alrdy of TEXTCHANNEL <#${textChannel.id}>.`
				),
				ephemeral: true
			});
			return;

		}

		const buttonResponse = await interaction.reply({
			embeds: getEmbed(
				"WARNING",
				currentUpdateChannelId ?
					`Set update channel from <#${currentUpdateChannelId}> to <#${textChannel.id}>?` :
					`Set update channel to <#${textChannel.id}>?`
			),
			components: [yesNoBtns()]
		});
		const confirmation = await buttonResponse.awaitMessageComponent({
			filter: i => i.user.id === interaction.user.id,
			time: 30000
		});

		if (confirmation.customId === "no") {
			
			buttonResponse.edit({
				embeds: getEmbed(
					"SUCCESS",
					`Update terminated 👌. Update channel is currently <#${currentUpdateChannelId}>`
				),
				components: []
			});
			return;

		}

		buttonResponse.edit({
			embeds: getEmbed(
				"INFO",
				`Setting update channel <#${textChannel.id}>`
			),
			components: []
		});
		setGuildConfig(
			interaction.guildId,
			{ key: "updateChannelId", value: textChannel.id }
		);
		buttonResponse.edit({
			embeds: getEmbed(
				"SUCCESS",
				`Update channel set as <#${textChannel.id}>. Omedeto 👏.`
			)
		});

	}
}

module.exports = command;
