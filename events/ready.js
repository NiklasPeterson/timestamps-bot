const { updateBotActivity } = require('../utils/updateActivity');
const { Events } = require('discord.js');

// When the client is ready, run this code (only once)
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		try {
			console.log(`Ready! Logged in as ${client.user.tag}`);

			// Send a message to a specific log channel (if exists)
			const channelId = process.env.LOG_CHANNEL_ID;
			const channel = client.channels.cache.get(channelId);
			if (channel) {
				channel.send('I\'m awake!');
			}
			else {
				console.error('Log channel not found!');
			}

			// Update bot's activity with error handling
			updateBotActivity(client);

		}
		catch (error) {
			console.error('Error on ready event:', error);
		}
	},
};