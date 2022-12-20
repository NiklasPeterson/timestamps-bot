const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run

		const serverEmbed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTitle('Server Status:')
			.addFields(
				{ name: '**Name:**', value: `${interaction.guild.name}`, inline: false },
				{ name: '**Description:**', value: `${interaction.guild.description}`, inline: false },
				{ name: '**ID:**', value: `${interaction.guild.id}`, inline: false },
				{ name: '**Owner:**', value: `<@${interaction.guild.ownerId}>`, inline: false },
				{ name: '**Created at:**', value: `<t:${interaction.guild.createdTimestamp}:F>`, inline: false },
				{ name: '**Total members:**', value: `${interaction.guild.memberCount}`, inline: false },
			);

		await interaction.reply({
			embeds: [serverEmbed],
			ephemeral: true,
		});
	},
};