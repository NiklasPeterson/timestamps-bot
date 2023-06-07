const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { Network, Alchemy } = require('alchemy-sdk');

require('dotenv').config();

const ALCHEMY_API = process.env.ALCHEMY_API;


const settings = {
	apiKey: ALCHEMY_API,
	network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('show')
		.setDescription('Shows tokens in your wallet.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('From which collection is the NFT you want to show?')
				.setRequired(true)
				.addChoices(
					// { name: 'Wallet', value: 'wallet' },
					{ name: 'Roboto', value: 'roboto' },
					{ name: 'Robopet', value: 'robopet' },
				))
		.addStringOption(option =>
			option.setName('id')
				.setDescription('Enter the ID of the NFT you want to show.')
				.setRequired(true)),
	async execute(interaction) {

		const type = interaction.options.getString('type');
		const id = interaction.options.getString('id');

		const collection = await getCollectionData(type, id);

		const holdersEmbed = new EmbedBuilder()
			.setColor('#897DD8')
			.setTitle(collection.name)
			.setImage(collection.image);

		await interaction.reply({
			embeds: [holdersEmbed],
		});
	},
};

async function getCollectionData(type, id) {
	let collectionData;

	if (type == 'wallet') {
		await alchemy.nft.getNftsForOwner(id, {
			contractAddresses: ['0x099689220846644f87d1137665cded7bf3422747', '0x4e962d488412a14aa37eacadcb83f18c7e2271a7'],
			withMetadata: true,
		})
			.then(data => collectionData = data.ownedNfts[0].metadata)
			.catch(err => console.error(err));
		return collectionData;
	}

	if (type == 'roboto') {
		await alchemy.nft.getNftMetadata(
			'0x099689220846644f87d1137665cded7bf3422747',
			id,
		)
			.then(data => collectionData = data.rawMetadata)
			.catch(err => console.error(err));
		return collectionData;
	}

	if (type == 'robopet') {
		await alchemy.nft.getNftMetadata(
			'0x4e962d488412a14aa37eacadcb83f18c7e2271a7',
			id,
		)
			.then(data => collectionData = data.rawMetadata)
			.catch(err => console.error(err));
		return collectionData;
	}
}