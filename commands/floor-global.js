const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

require('dotenv').config();
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('floor')
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
		const type = interaction.options.getString('type');

		const robotos = await getCollectionData('robotos-official');
		const robopets = await getCollectionData('robopets');
		const robotosFloorPrice = Number(robotos.stats.floor_price.toFixed(3));
		const robopetsFloorPrice = Number(robopets.stats.floor_price.toFixed(3));

		const humankind = await getCollectionData('humankind-collectibles');
		const lunchboxes = await getCollectionData('humankind-lunchboxes');
		const humankindFloorPrice = Number(humankind.stats.floor_price.toFixed(3));
		const lunchboxesFloorPrice = Number(lunchboxes.stats.floor_price.toFixed(3));

		let firstCollectionName;
		let firstCollection;
		let secondCollectionName;
		let secondCollection;

		if (type == 'robotos') {
			firstCollectionName = 'Robotos';
			secondCollectionName = 'Robopet';
			firstCollection = robotosFloorPrice;
			secondCollection = robopetsFloorPrice;
		}

		if (type == 'humankind') {
			firstCollectionName = 'Humankind';
			secondCollectionName = 'Lunchboxes';
			firstCollection = humankindFloorPrice;
			secondCollection = lunchboxesFloorPrice;
		}

		const floorEmbed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTitle('Floor Price')
			.addFields(
				{ name: `**${firstCollectionName}**`, value: `${firstCollection}Ξ`, inline: true },
				{ name: `**${secondCollectionName}**`, value: `${secondCollection}Ξ`, inline: true },
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