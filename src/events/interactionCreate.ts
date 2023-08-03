import { Events, Interaction } from "discord.js";
import { BotCommand, BotEvent } from "../types";
import { getEmbed } from "../utils/message";

const event: BotEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction: Interaction) {

		if (!interaction.isChatInputCommand()) return;
		const command = interaction.client.commands.get(interaction.commandName) as BotCommand;
	
		try {

			await command.execute(interaction);

		} catch (error) {

			console.error(error);
			await interaction.followUp({
				embeds: getEmbed(
					"ERROR",
					"There was an error while executing this command!"
				),
				ephemeral: true
			});

		}

	}
}

module.exports = event;
