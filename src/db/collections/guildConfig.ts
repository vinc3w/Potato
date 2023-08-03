import { db, cache } from "../db";

const collection = db.collection("guildConfigs");
const { guildConfigs } = cache;

export function getGuildConfig(guildId: string) {

	return guildConfigs.find(i => i.id === guildId)

}
export function getAllGuildConfig() {

	return guildConfigs; 

}

type UpdateObject = {
	key: "updateChannelId", value: string | undefined
}
export async function setGuildConfig(guildId: string, update: UpdateObject) {

	const guildConfig = getGuildConfig(guildId);
	if (!guildConfig) {

		const newGuildConfig = {
			id: guildId,
			[update.key]: update.value
		};
		guildConfigs.push(newGuildConfig);
		await collection.insertOne(newGuildConfig);

	}
	else {
		
		guildConfig[update.key] = update.value;
		await collection.updateOne(
			{ id: guildId },
			{ $set: { [update.key]: update.value } }
		);

	}
	return true;

}

export async function deleteGuildConfig(guildId: string) {

	const guildConfig = getGuildConfig(guildId);
	if (!guildConfig) return false;

	cache.guildConfigs = guildConfigs.filter(
		config => config.id != guildId
	);
	await collection.deleteOne({ id: guildId });
	return true;

}
