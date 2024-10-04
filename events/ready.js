const { Events, ActivityType } = require('discord.js');

// When the client is ready, run this code (only once)
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const channelId = process.env.LOG_CHANNEL_ID;
		const channel = client.channels.cache.get(channelId);
		if (channel) {
			channel.send(`I'm awake!`);
		}
		else {
			console.error('Channel not found!');
		}

		client.user.setActivity(`Used in ${client.guilds.cache.size} servers`, { type: ActivityType.Custom });
	},
};