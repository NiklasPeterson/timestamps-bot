const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('floor-price')
    .setDescription('Shows the floor price.'),
  async execute(interaction) {

    const humankind = await getCollectionData('humankind-collectibles');
    const lunchboxes = await getCollectionData('humankind-lunchboxes');
    const humankindFloorPrice = Number(humankind.stats.floor_price.toFixed(3));
    const lunchboxesFloorPrice = Number(lunchboxes.stats.floor_price.toFixed(3));

    const floorEmbed = new EmbedBuilder()
      .setColor('#ffffff')
      .setTitle('Floor Price')
      .addFields(
        { name: '**Humankind:**', value: `${humankindFloorPrice}Ξ`, inline: true },
        { name: '**Lunchboxes:**', value: `${lunchboxesFloorPrice}Ξ`, inline: true },
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