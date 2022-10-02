const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(`Shows the current ping from the bot to the discord servers`),

	async execute(interaction) {
		
		let embed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTitle('Bot Status:')
			.setDescription(`
**Bot name:** ${interaction.client.user.tag}
**Websocket heartbeat:** ${interaction.client.ws.ping}ms.
**Uptime:** ${interaction.client.uptime / 60000} mins
`)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};