const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const fetch = require('node-fetch');

const ALCHEMY_API = process.env.ALCHEMY_API;
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API}/getOwnersForCollection/`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kinds')
    .setDescription('Shows the amount of collectors.'),
  async execute(interaction) {

    const humankind = await getCollectionData('0xb20e024da94fEf84B5dbDE3a639048952De58169');
    const lunchbox = await getCollectionData('0xA30CF1135BE5Af62E412f22BD01069e2CEbA8706');

    const holdersEmbed = new EmbedBuilder()
      .setColor('#ffffff')
      .setTitle('Holders')
      .addFields(
        { name: '**Humankind:**', value: `${humankind}`, inline: true },
        { name: '**Lunchboxes:**', value: `${lunchbox}`, inline: true },
      );

    await interaction.reply({
      embeds: [holdersEmbed],
      ephemeral: true,
    });
  },
};

async function getCollectionData(contract) {
  const contractAddress = contract;
  const collectionResp = await fetch(`${baseURL}?contractAddress=${contractAddress}`);

  if (collectionResp.ok) {
    const result = await collectionResp.json();
    const collectionData = result.ownerAddresses.length;
    return collectionData;
  }
}