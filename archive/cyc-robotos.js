const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cyc')
    .setDescription('Provides information about the cYC community.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('The Cyborgee Yacht Club (cYC)')
      .setDescription(`is a group of sailing enthusiasts, philanthropists, early adopters and collectors of some of Robotolands most exclusive digital art. The “c” is small because so are the cyborgees.

      Full membership (known as charter members) is available to those who hold a Robopet with both the yacht and cyborgee traits. Associate Membership is available to all other Robopets with Yachts`);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};