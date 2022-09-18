const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require('discord.js')


module.exports = {
    name: "verify",
    timeout: 5,
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Sends a verify Link in this channel.')
        .addChannelOption(option => option.setName('destination')
            .setDescription('Select a channel')
            .setRequired(true))
        .addStringOption(option => option.setName('url')
            .setDescription('Enter a url')
            .setRequired(true))
        .setDefaultMemberPermissions(0),

    async execute(interaction) {
        const channel = interaction.options.getChannel('destination');
        const string = interaction.options.getString('url');
        const member = interaction.member;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Verify')
                    .setStyle('LINK')
                    .setURL(string),
            )

        const embeded = new MessageEmbed()
            .setColor('#ffffff')
            .setTitle('Verify your assets')
            .setDescription('Press the button below to verify your assets!')
        
        await interaction.reply('Loading...');
        await interaction.deleteReply();

        await channel.send({
            components: [row],
            embeds: [embeded]
        })

    }
}