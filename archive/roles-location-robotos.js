const { SlashCommandBuilder } = require('discord.js');

const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles-location')
    .setDescription('Configures location Roles in specified channel.')
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
        .setColor('#897DD8')
        .setTitle('Where are you based?')
        .setDescription(`We want to get a better sense of where our community members come from, and by finding out where you all are located, we'll be able to create more inclusive experiences down the line.
**Let us know where you are from by reacting to the animals representing the different locations:**
        `);

      let btnRow = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId('northAmericaBtn')
          .setLabel('North America')
          .setStyle('Secondary')
          .setEmoji('🐻'),
        new ButtonBuilder()
          .setCustomId('latinAmericaBtn')
          .setLabel('Latin America')
          .setStyle('Secondary')
          .setEmoji('🦙'),
        new ButtonBuilder()
          .setCustomId('europeBtn')
          .setLabel('Europe')
          .setStyle('Secondary')
          .setEmoji('🦊'),
        new ButtonBuilder()
          .setCustomId('asiaBtn')
          .setLabel('Asia')
          .setStyle('Secondary')
          .setEmoji('🐼'),
        new ButtonBuilder()
          .setCustomId('oceaniaBtn')
          .setLabel('Oceania')
          .setStyle('Secondary')
          .setEmoji('🐠'),
        new ButtonBuilder()
          .setCustomId('africaBtn')
          .setLabel('Africa')
          .setStyle('Secondary')
          .setEmoji('🦒'),
        new ButtonBuilder()
          .setCustomId('middleEastBtn')
          .setLabel('Middle East')
          .setStyle('Secondary')
          .setEmoji('🐫'),
      ]);

      await selectedChannel.send({
        embeds: [embed],
        components: [btnRow],
      });

      interaction.reply({
        content: `Claim roles system set up in ${selectedChannel}.`,
        ephemeral: true,
      });
    }
  }
}