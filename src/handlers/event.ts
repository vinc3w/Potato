import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotEvent } from "../types";

module.exports = (client: Client) => {

	const eventsDir = join(__dirname, "../events");
	const eventFiles = readdirSync(eventsDir);
	eventFiles.forEach(file => {
		const event: BotEvent = require(join(eventsDir, file));
		if (event.once)
			client.once(event.name, (...args) => event.execute(...args));
		else
			client.on(event.name, (...args) => event.execute(...args, client));
	})
	console.log("Events ready!");

}
