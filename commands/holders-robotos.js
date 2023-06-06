const { SlashCommandBuilder } = require('discord.js');

const { EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');
// import config IDs
dotenv.config();

const fetch = require('node-fetch');

// Replace with your Alchemy API key:
const ALCHEMY_API = process.env.ALCHEMY_API;
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API}/getOwnersForCollection/`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('holders')
    .setDescription('Shows the amount of holders.'),
  async execute(interaction) {

    const robotos = await getCollectionData('0x099689220846644f87d1137665cded7bf3422747');
    const robopets = await getCollectionData('0x4e962d488412a14aa37eacadcb83f18c7e2271a7');
    // const robotosNiftyHolders = await getRobotosNiftyHolders();
    // const robopetsNiftyHolders = await getRobopetsNiftyHolders();

    // const robotosEmbed = new EmbedBuilder()
    // 	.setColor('#897DD8')
    // 	.setTitle('Robotos Holders')
    // 	.addFields(
    // 		// { name: '**Total:**', value: `${robotos.stats.num_owners + robotosNiftyHolders}`, inline: true },
    // 		{ name: '**ETH Wallets:**', value: `${robotos}`, inline: true },
    // 		// { name: '**Nifty Gateway:**', value: `${robotosNiftyHolders}`, inline: true },
    // 	);

    // const robopetsEmbed = new EmbedBuilder()
    // 	.setColor('#897DD8')
    // 	.setTitle('Robopets Holders')
    // 	.addFields(
    // 		// { name: '**Total:**', value: `${robopets.stats.num_owners + robopetsNiftyHolders}`, inline: true },
    // 		{ name: '**ETH Wallets:**', value: `${robopets}`, inline: true },
    // 		// { name: '**Nifty Gateway:**', value: `${robopetsNiftyHolders}`, inline: true },
    // 	);


    const holdersEmbed = new EmbedBuilder()
      .setColor('#897DD8')
      .setTitle('Holders')
      .addFields(
        // { name: '**Total:**', value: `${robotos.stats.num_owners + robotosNiftyHolders}`, inline: true },
        { name: '**Robotos:**', value: `${robotos}`, inline: true },
        { name: '**Robopets:**', value: `${robopets}`, inline: true },
        // { name: '**Nifty Gateway:**', value: `${robotosNiftyHolders}`, inline: true },
      );

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

// async function getRobotosNiftyHolders() {
// 	const response = await fetch(
// 		'https://api.niftygateway.com/v1/creators/robotos/collectors?limit=10000',
// 	);
// 	const holders = {};
// 	if (response.ok) {
// 		const data = await response.json();
// 		data.results.forEach((result) => {
// 			holders[result.owner.username] = true;
// 			// Needs to check for contract "contractAddress": "0x099689220846644f87d1137665cded7bf3422747",
// 		});
// 	}

// 	return Object.keys(holders).length;
// }

// async function getRobopetsNiftyHolders() {
// 	const response = await fetch(
// 		'https://api.niftygateway.com/v1/creators/robotos/collectors?limit=10000',
// 	);
// 	const holders = {};
// 	if (response.ok) {
// 		const data = await response.json();
// 		data.results.forEach((result) => {
// 			holders[result.owner.username] = true;
// 			// Needs to check for contract "contractAddress": "0x4e962d488412a14aa37eacadcb83f18c7e2271a7",
// 		});
// 	}

// 	return Object.keys(holders).length;
// }