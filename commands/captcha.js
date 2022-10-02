const { SlashCommandBuilder } = require('discord.js');

const {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder
} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('captcha')
		.setDescription('Setup a captcha verification system')
		.setDefaultMemberPermissions(0)
		.addChannelOption(option => option
			.setName('destination')
			.setDescription('Select which channel to send the captcha to')
			.setRequired(true)),
		// .addRoleOption(option => option
		// 	.setName('role')
		// 	.setDescription('Select a which role should be added upon completing the captcha')
		// 	.setRequired(true)),

	async execute(interaction) {

		const verifyChannel = interaction.options.getChannel('destination');
		// verifyRole = interaction.options.getRole('role');

		// if (!interaction.member.permissions.has("MANAGE_ROLES")) {
		// 	return interaction.reply({
		// 		content: `You don't have perms to run command`,
		// 		ephemeral: true,
		// 	});
		// }

		// if (!verifyChannel || !verifyRole) {
		if (!verifyChannel) {
			return interaction.reply({
				content: `verifyChannel is not found`,
				ephemeral: true,
			});
		} else {
			let embed = new EmbedBuilder()
				.setColor("#ffffff")
				.setTitle(`Welcome to ${interaction.guild.name}`)
				.setDescription(`To get access to this server you'll need to verify that you are a human by completing the captcha
				
Press the **Verify** button below to get started.`)

			let btnRow = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId(`verifyBtn`)
					.setLabel("Verify")
					.setStyle("Success"),
			]);

			await verifyChannel.send({
				embeds: [embed],
				components: [btnRow],
			});

			interaction.reply({
				// content: `Verification system setup in ${verifyChannel}, users will get the ${verifyRole} role after completing the captcha.`,
				content: `Verification system setup in ${verifyChannel}.`,
				ephemeral: true,
			});
		}
	}
}