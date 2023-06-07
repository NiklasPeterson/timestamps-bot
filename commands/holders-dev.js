const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// const { Network, Alchemy } = require('alchemy-sdk');

require('dotenv').config();

const ALCHEMY_API = process.env.ALCHEMY_API;

const fetch = require('node-fetch');

const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API}/getOwnersForCollection/`;

// const settings = {
// 	apiKey: ALCHEMY_API,
// 	network: Network.ETH_MAINNET,
// };

// const alchemy = new Alchemy(settings);

module.exports = {
	data: new SlashCommandBuilder()
	.setName('holders')
	.setDescription('Shows the amount of holders.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('From which project do you want to get the amount of holders?')
				.setRequired(true)
				.addChoices(
					{ name: 'Robotos', value: 'robotos' },
					{ name: 'Humankind', value: 'humankind' },
				)),
	async execute(interaction) {

		const humankind = await getCollectionData('0xb20e024da94fEf84B5dbDE3a639048952De58169');
    const lunchbox = await getCollectionData('0xA30CF1135BE5Af62E412f22BD01069e2CEbA8706');
    const robotos = await getCollectionData('0x099689220846644f87d1137665cded7bf3422747');
    const robopets = await getCollectionData('0x4e962d488412a14aa37eacadcb83f18c7e2271a7');

		const type = interaction.options.getString('type');

		if (type == 'robotos') {
		const holdersEmbed = new EmbedBuilder()
      .setColor('#ffffff')
      .setTitle('Holders')
      .addFields(
        { name: '**Humankind:**', value: `${humankind}`, inline: true },
        { name: '**Lunchboxes:**', value: `${lunchbox}`, inline: true },
      );
		} else {
			const holdersEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Holders')
      .addFields(
        { name: '**Robotos:**', value: `${robotos}`, inline: true },
        { name: '**Robopets:**', value: `${robopets}`, inline: true },
      );
		}

		await interaction.reply({
			embeds: [holdersEmbed],
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