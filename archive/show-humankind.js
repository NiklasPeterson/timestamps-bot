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
		.setName('show-kind')
		.setDescription('Shows tokens in your wallet.')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('From which collection is the NFT you want to show?')
				.setRequired(true)
				.addChoices(
					// { name: 'Wallet', value: 'wallet' },
					{ name: 'Humankind', value: 'humankind' },
					{ name: 'Lunchbox', value: 'lunchbox' },
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
			.setColor('#ffffff')
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

	if (type == 'humankind') {
		await alchemy.nft.getNftMetadata(
			'0xb20e024da94fEf84B5dbDE3a639048952De58169',
			id,
		)
			.then(data => collectionData = data.rawMetadata)
			.catch(err => console.error(err));
		return collectionData;
	}

	if (type == 'lunchbox') {
		await alchemy.nft.getNftMetadata(
			'0xA30CF1135BE5Af62E412f22BD01069e2CEbA8706',
			id,
		)
			.then(data => collectionData = data.rawMetadata)
			.catch(err => console.error(err));
		return collectionData;
	}
}