const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	execute(client) {
		// console.log(`Guild joined: ${guild.name}`);
		updateActivity(client);
	},
};

// Function to update the bot's activity
function updateActivity(client) {
	client.user.setActivity(`Used in ${client.guilds.cache.size} servers`, { type: ActivityType.Custom });
}