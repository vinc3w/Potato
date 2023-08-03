import { MongoClient, ServerApiVersion, Db } from "mongodb";
import { BotDb } from "../types";

const client = new MongoClient(process.env.MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

export const db: Db = client.db("potato"); 

export const cache: BotDb = {
	guildConfigs: []
};

export async function initializeDb() {

	await client.connect();

	const collections = await db.collection("guildConfigs").find().toArray()
	collections.forEach(collection => {
		cache.guildConfigs.push({
			id: collection.id,
			updateChannelId: collection.updateChannelId
		});
	})

	console.log(cache)
	console.log("MongoDb ready!");

}
