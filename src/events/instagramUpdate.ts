import { Client, EmbedBuilder, TextBasedChannel } from "discord.js";
import { BotEvent, InstagramMedia } from "../types";
import { getAllGuildConfig } from "../db/collections/guildConfig";
import { getMessageColor } from "../utils/message";
import { emojis } from "../config";

const event: BotEvent = {
	name: "instagramUpdate",
	once: false,
	execute(media: InstagramMedia, client: Client) {

		const guildConfigs = getAllGuildConfig();
		for (const guildConfig of guildConfigs) {
			
			const updateChannelId = guildConfig.updateChannelId;
			if (!updateChannelId) break;

			const textChannel = client.guilds.cache.get(guildConfig.id)
													?.channels.cache.get(updateChannelId) as TextBasedChannel;
			if (!textChannel) break;

			const ramdomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
			const embed = new EmbedBuilder()
				.setColor(getMessageColor("JIHYO"))
				.setDescription(media.caption || null)
				.setImage(media.media_url)
				.setTimestamp(Date.parse(media.timestamp))
				.setFooter({
					text: `${ramdomEmoji} - @${media.username}`
				});
			textChannel.send({ embeds: [embed] });
			
		}
		
	}
}

module.exports = event;
