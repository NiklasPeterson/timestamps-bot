const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gmmm')
    .setDescription('GMMM!'),
  async execute(interaction) {

  const responses = [
    'https://tenor.com/view/ese-pelito-pedro-coral-pedro-el-escamoso-feliz-alegre-gif-19087398',
    'https://cdn.discordapp.com/attachments/905301341755293696/913171204846809130/4F47ED78-BFC7-473C-99E4-C60A50CAC454.png',
    'https://cdn.discordapp.com/attachments/873261010314723419/913225426464280646/pompirri.gif',
   ];

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('GMMM')
      .setImage(responses[Math.floor(Math.random() * responses.length)]);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};