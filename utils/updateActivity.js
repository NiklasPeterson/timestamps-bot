const { ActivityType } = require('discord.js');

// Helper function to update bot's activity
function updateBotActivity(client) {
	try {
		const totalServers = client.guilds.cache.size;
		client.user.setActivity(`Used in ${totalServers} servers`, { type: ActivityType.Custom });
		// console.log(`Updated activity: Used in ${totalServers} servers`);
	}
	catch (error) {
		console.error('Error updating bot activity:', error);
	}
}

module.exports = {
	updateBotActivity,
};