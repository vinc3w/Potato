import { Client, GatewayIntentBits, Collection } from "discord.js"
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

config();

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
];
const client = new Client({ intents });
client.commands = new Collection();

const handlersDir = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersDir);
handlerFiles.forEach(file => {
	require(join(handlersDir, file))(client);
})

client.login(process.env.DISCORD_CLIENT_TOKEN);
