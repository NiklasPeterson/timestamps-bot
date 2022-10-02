const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription(`Shows server info`),
	async execute(interaction) {

		let embed = new EmbedBuilder()
				.setColor('#ffffff')
				.setTitle('Server Status:')
				.setDescription(`
**Name:** ${interaction.guild.name}
**Description:** ${interaction.guild.description}
**ID:** ${interaction.guild.id}
**Owner:** <@${interaction.guild.ownerId}>
**Created at:** <t:${interaction.guild.createdTimestamp}:F>
**Total members:** ${interaction.guild.memberCount}
`)

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};