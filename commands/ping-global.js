const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Provides information about the bot.'),
	async execute(interaction) {

		const pingEmbed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTitle('Bot Status:')
			.addFields(
				{ name: '**Username:**', value: `${interaction.client.user.tag}`, inline: false },
				{ name: '**Websocket heartbeat:**', value: `${interaction.client.ws.ping}ms`, inline: false },
				{ name: '**Uptime:**', value: `${interaction.client.uptime / 60000} mins`, inline: false },
			);

		await interaction.reply({
			embeds: [pingEmbed],
			ephemeral: true,
		});
	},
};