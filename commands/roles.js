const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: "roles",
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
				content: `selectedChannel is not found`,
				ephemeral: true,
			});
		} else {
			let embed = new MessageEmbed()
				.setColor("#ffffff")
				.setTitle(`Get notifications`)
				.setDescription(`Press the buttons to get notifications based on the different topics!`)

			let btnRow = new MessageActionRow().addComponents([
				new MessageButton()
					.setCustomId(`allowlistBtn`)
					.setLabel("Allowlist Alerts")
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomId(`securityBtn`)
					.setLabel("Security Alerts")
					.setStyle("SECONDARY"),
                new MessageButton()
					.setCustomId(`alphaBtn`)
					.setLabel("Alpha Alerts")
					.setStyle("PRIMARY"),
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