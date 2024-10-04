const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	execute(client) {
		// console.log(`Guild left: ${guild.name}`);
		updateActivity(client);
	},
};

// Function to update the bot's activity
function updateActivity(client) {
	client.user.setActivity(`Used in ${client.guilds.cache.size} servers`, { type: ActivityType.Custom });
}