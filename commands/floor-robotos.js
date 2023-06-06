const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('floor')
    .setDescription('Shows the floor price.'),
  async execute(interaction) {

    const robotos = await getCollectionData('robotos-official');
    const robopets = await getCollectionData('robopets');
    const robotosFloorPrice = Number(robotos.stats.floor_price.toFixed(3));
    const robopetsFloorPrice = Number(robopets.stats.floor_price.toFixed(3));

    const floorEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Floor Price')
      .addFields(
        { name: '**Robotos:**', value: `${robotosFloorPrice}Ξ`, inline: true },
        { name: '**Robopets:**', value: `${robopetsFloorPrice}Ξ`, inline: true },
      );

    await interaction.reply({
      embeds: [floorEmbed],
      ephemeral: true,
    });
  },
};

async function getCollectionData(collectionSlug) {
  const collectionResp = await fetch(
    `https://api.opensea.io/api/v1/collection/${collectionSlug}/stats`,
    {
      headers: {
        'X-API-Key': '45761fbb43f842efbf6f6d395b3b594f',
      },
    },
  );
  const collectionData = await collectionResp.json();

  return collectionData;
}