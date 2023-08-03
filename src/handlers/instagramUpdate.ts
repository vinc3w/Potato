import { Client } from "discord.js";
import fetch from "node-fetch";
import cron from "node-cron";
import { InstagramMedia } from "../types";

let access_token: string = process.env.INSTAGRAM_ACCESS_TOKEN;
let tokenResponse: any;

async function getToken() {
	const url = `
		https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${access_token}
	`;
	interface TokenData {
		access_token: string,
		token_type: string,
		expires_in: number
	}
	const response = await fetch(url);
	const token: TokenData = await response.json();
	tokenResponse = token;
	access_token = token.access_token;
}

async function fetchMediaList() {
	const url = `
		https://graph.instagram.com/${process.env.INSTAGRAM_APP_ID}/media?fields=id,username,media_type,media_url,caption,timestamp&access_token=${access_token}
	`;
	const response = await fetch(url);
	return (await response.json()).data as InstagramMedia[];
}

module.exports = async (client: Client) => {

	try {

		await getToken();

		const foo = await fetchMediaList();
		let currentNumOfMedia = foo.length;

		cron.schedule("* * * * *", async () => {
				
			const jsonData = await fetchMediaList();
			if (jsonData.length > currentNumOfMedia) {

				currentNumOfMedia++;
				const newMedia = jsonData[0];
				client.emit("instagramUpdate", newMedia);

			}

		})

		cron.schedule("* 0 0 1 * *", getToken);

	}
	catch(e) {

		console.error({
			message: "Error with instagram api",
			tokenResponse
		})

	}
	
}
