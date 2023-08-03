import { Client, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { BotCommand } from "../types";

module.exports = async (client: Client) => {

	const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

	const commandsDir = join(__dirname, "../commands");
	const commandFolders = readdirSync(commandsDir);
	commandFolders.forEach(folder => {

		const commandFiles = readdirSync(join(commandsDir, folder));
		commandFiles.forEach(file => {

			const command: BotCommand = require(join(commandsDir, folder, file));
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());

		})

	})

	try {
	
		const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN);
		const data: any = await rest.put(
			Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
			{ body: commands }
		);
		console.log(`Successfully loaded ${data.length} slash commands!`);

	} catch (error) {

		console.error(error);

	}

}
