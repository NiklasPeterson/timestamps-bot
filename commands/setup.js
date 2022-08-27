const {
	SlashCommandBuilder
} = require('@discordjs/builders');

const {
	MessageActionRow,
	MessageButton,
	MessageEmbed
} = require('discord.js')

module.exports = {
	name: "setup",
	timeout: 5,
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Setup a captcha verification system')
		.addChannelOption(option => option
			.setName('destination')
			.setDescription('Select which channel to send the captcha to')
			.setRequired(true))
		.addRoleOption(option => option
			.setName('role')
			.setDescription('Select a which role should be added upon completing the captcha')
			.setRequired(true)),

	async execute(interaction) {

		const verifyChannel = interaction.options.getChannel('destination');
		verifyRole = interaction.options.getRole('role');

		if (!interaction.member.permissions.has("MANAGE_ROLES")) {
			return interaction.reply({
				content: `You don't have perms to run command`,
				ephemeral: true,
			});
		}

		if (!verifyChannel || !verifyRole) {
			return interaction.reply({
				content: `verifyChannel and verifyRole is not found`,
				ephemeral: true,
			});
		} else {
			let embed = new MessageEmbed()
				// .setFooter("Verification Period: 1 minutes")
				.setColor("WHITE")
				.setTitle(`Gatekeeper of ${interaction.guild.name}`)
				.setDescription(`Welcome to ${interaction.guild.name}! To get access to this server verify that you arent a bot by completing the captcha.

			  **Click the button below to get started.**`)

			let btnRow = new MessageActionRow().addComponents([
				new MessageButton()
					.setCustomId(`verifyBtn`)
					.setLabel("Verify")
					.setStyle("SUCCESS"),
			]);

			await verifyChannel.send({
				embeds: [embed],
				components: [btnRow],
			});

			interaction.reply({
				content: `Verification System Setup in ${verifyChannel} and Verify Role is ${verifyRole}`,
				ephemeral: true,
			});

			return verifyRole;
		}

		// await interaction.reply('Loading...');
		// await interaction.deleteReply();

	}
}