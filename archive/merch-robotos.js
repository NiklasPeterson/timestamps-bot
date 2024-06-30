const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('merch')
    .setDescription('Provides information about Robotos Shop.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Robotos Shop')
      .setDescription(`A shop where you can get some awesome Robotos merch to celebrate your love for Robotos.
      https://shop.robotos.art `);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};