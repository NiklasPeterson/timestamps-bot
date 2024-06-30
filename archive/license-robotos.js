const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('license')
    .setDescription('Provides information about license.'),
  async execute(interaction) {

    const messageEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('License')
      .setDescription(`Robotos grants a non-exclusive license to use the NFT artwork for personal and commercial use and purposes. The license covers the non-exclusive right to reproduce, sell and distribute the artwork from your NFT, including reprints, translations, photographic reproductions, microform, electronic form (offline, online), or any other reproductions of similar nature. Licensor grants you a non-exclusive worldwide license to use, copy, and display the purchased Art for the purpose of creating derivative works based upon the Art. 

      For more details and legal stuff, you can read our full license: https://www.robotos.art/license`);

    await interaction.reply({
      embeds: [messageEmbed],
    });
  },
};