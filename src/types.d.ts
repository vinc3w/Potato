import { MongoClient } from "mongodb";
import {
	Collection,
	GuildMember,
	Interaction,
	Message,
	SlashCommandBuilder,
	TextChannel,
	VoiceChannel
} from "discord.js";

export interface BotCommand {
	data: SlashCommandBuilder,
	execute(message: Interaction): void
}

export interface BotEvent {
	name: string,
	once: boolean,
	execute(...args: any): void
}

export interface GuildConfig {
	id: string,
	updateChannelId?: string,
}

export interface BotDb {
	guildConfigs: GuildConfig[]
}

export interface InstagramMedia {
	id: string,
	username: string,
	media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM",
	media_url: string,
	caption?: string,
	timestamp: string
}

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, BotCommand>,
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_CLIENT_TOKEN: string,
			DISCORD_CLIENT_ID: string,
			MONGODB_URI: string,
			INSTAGRAM_APP_ID: string,
			INSTAGRAM_CLIENT_SECRET: string,
			INSTAGRAM_ACCESS_TOKEN: string
		}
	}
}
