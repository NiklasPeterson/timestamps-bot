const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ccc')
    .setDescription('Provides information about the CCC community.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('The Cyborgo Country Club')
      .setDescription(`is where Cyborgos go to practice their golf skills, sip fine wines, and look absolutely dashing in their CCC attire. The club currently exists as members-only Discord channels, with plans to expand on it in the Robotos metaverse (Robotoland). For membership inquiries, reach out to a Cyborgo Membership Associate.`);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};