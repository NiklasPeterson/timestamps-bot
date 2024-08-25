const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Replies with "Hello there!"'),
  async execute(interaction) {
    await interaction.reply('Hello there!');
  },
};