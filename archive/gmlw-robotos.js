const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gmlw')
    .setDescription('GMLW!'),
  async execute(interaction) {

  const responses = [
    '🤼 🤼‍♂️ 🤼‍♀️ 🤼‍♀️ 🤼',
    '🤼‍♀️ 🤼 🤼 🤼‍♀️ 🤼‍♂️',
    'https://tinyurl.com/gmlwc2022',
   ];

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('GMLW')
      .setImage(responses[Math.floor(Math.random() * responses.length)]);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};