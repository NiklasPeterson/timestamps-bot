const { SlashCommandBuilder } = require('discord.js');

const {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder
} = require('discord.js')

module.exports = {
	name: 'roles',
	timeout: 5,
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Configures Claim Roles in specified channel.')
		.setDefaultMemberPermissions(0)
		.addChannelOption(option => option
			.setName('destination')
			.setDescription('Select a channel')
			.setRequired(true)),

	async execute(interaction) {

		const selectedChannel = interaction.options.getChannel('destination');

		if (!selectedChannel) {
			return interaction.reply({
				content: 'selectedChannel is not found',
				ephemeral: true,
			});
		} else {
			let embed = new EmbedBuilder()
				.setColor('#ffffff')
				.setTitle('Get notifications')
				.setDescription('Press the buttons to get notifications based on the different topics!')

			let btnRow = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('allowlistBtn')
					.setLabel('Allowlist Alerts')
					.setStyle('Success'),
				new ButtonBuilder()
					.setCustomId('securityBtn')
					.setLabel('Security Alerts')
					.setStyle('Secondary'),
				new ButtonBuilder()
					.setCustomId('scamBtn')
					.setLabel('Scam Alerts')
					.setStyle('Danger'),
				new ButtonBuilder()
					.setCustomId('alphaBtn')
					.setLabel('Alpha Alerts')
					.setStyle('Primary'),

			]);

			await selectedChannel.send({
				embeds: [embed],
				components: [btnRow],
			});

			interaction.reply({
				content: `Claim roles system setup in ${selectedChannel}.`,
				ephemeral: true,
			});
		}
	}
}