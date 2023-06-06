const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

require('dotenv').config();

const fetch = require('node-fetch');

const ALCHEMY_API = process.env.ALCHEMY_API;
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API}`;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show-wallet')
		.setDescription('Shows tokens in your wallet.')
		.addStringOption(option =>
			option.setName('address')
				.setDescription('For wallet pass in your address, for token pass in your ID.')
				.setRequired(true)),
	async execute(interaction) {

		const address = interaction.options.getString('address');
		const collection = await getCollectionData(address);

		const holdersEmbed = new EmbedBuilder()
			.setColor('#897DD8')
			.setTitle('Showing Tokens in wallet')
			.setDescription(collection.ownedNfts[0].metadata.name)
			.setImage(collection.ownedNfts[0].metadata.image);

		await interaction.reply({
			embeds: [holdersEmbed],
			ephemeral: true,
		});
	},

};

async function getCollectionData(address) {
	const collectionResp = await fetch(`${baseURL}/getNFTs?owner=${address}&pageSize=100&contractAddresses[]=0x099689220846644f87d1137665cded7bf3422747&contractAddresses[]=0x4e962d488412a14aa37eacadcb83f18c7e2271a7&withMetadata=true`);
	// .then(response => response.json())
	// .then(response => console.log(response.ownedNfts))
	// .catch(err => console.error(err));
	const collectionData = await collectionResp.json();
	console.log(collectionData);

	return collectionData;
}
