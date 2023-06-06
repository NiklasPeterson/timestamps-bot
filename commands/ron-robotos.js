const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ron')
    .setDescription('Provides information about the Robotos Workshop.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Ronathan Ronaldus Mulleto')
      .setThumbnail('https://cdn.discordapp.com/attachments/1022205646852083822/1022205647095332965/RON.gif')
      .setDescription(`Ron never wanted to be a hero. He never wanted the glances from neighbours walking the street, or the whispers from strangers when he entered a room. He never wanted the attention, but the story of Ron deserves to be told, so listen closely...`)
      .addFields(
        { name: 'Read the legendary story about Ron 👇', value: 'https://discord.com/channels/863524941436420128/1022205646852083822', inline: false },
      );

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};