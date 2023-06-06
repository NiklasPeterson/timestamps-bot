const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('workshop')
    .setDescription('Provides information about the Robotos Workshop.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Robotos Workshop')
      .setDescription(`A place where you can create awesome banners and also Suit Up your Botos using different costumes!
      https://www.robotos.art/workshop `);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};