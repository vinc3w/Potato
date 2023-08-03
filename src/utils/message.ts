import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { ERROR_COLOUR, INFO_COLOUR, JIHYO_COLOR, SUCCESS_COLOUR, WARNING_COLOUR } from "../config"

type MessageType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "JIHYO";
export function getMessageColor(type: MessageType) {
	
	switch (type) {
		case "INFO": return INFO_COLOUR;
		case "SUCCESS": return SUCCESS_COLOUR;
		case "WARNING": return WARNING_COLOUR;
		case "ERROR": return ERROR_COLOUR;
		case "JIHYO": return JIHYO_COLOR;
	}

}

export function getEmbed(type: MessageType, text: string) {

	const embed = new EmbedBuilder()
		.setColor(getMessageColor(type))
		.setDescription(text);

	return [embed];
	
}

export function yesNoBtns() {

	const yesButton = new ButtonBuilder()
		.setCustomId('yes')
		.setLabel('Yes')
		.setStyle(ButtonStyle.Primary);

	const noButton = new ButtonBuilder()
		.setCustomId('no')
		.setLabel('No')
		.setStyle(ButtonStyle.Danger);

	const row = new ActionRowBuilder<ButtonBuilder>()
		.addComponents(yesButton, noButton);

	return row;

}
