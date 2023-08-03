import { Client, Events } from "discord.js";
import { BotEvent } from "../types";

const event: BotEvent = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client) {

		console.log(`Ready! Log in as ${client.user?.tag}!`);
		
	}
}

module.exports = event;
