const { Events, EmbedBuilder } = require('discord.js');

const dotenv = require('dotenv');
// import config IDs
dotenv.config();

const fetch = require('node-fetch');


const ALCHEMY_API = process.env.ALCHEMY_API;
const tnxUrl = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API}`;
const nftURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${ALCHEMY_API}`;
const contract = '0xb20e024da94fEf84B5dbDE3a639048952De58169';


module.exports = {
    name: Events.ClientReady,
    execute(client) {
        console.log(`${client.user.tag} is now online!`);

        const collection = await getBurnData();

        const holdersEmbed = new EmbedBuilder()
            .setColor('#897DD8')
            .setTitle('A new kind was has appeared')
            .setDescription(collection.name)
            .setImage(collection.image);

        await interaction.message({
            embeds: [holdersEmbed],
            ephemeral: true,
        });


        async function getBurnData() {
            const options = {
                method: 'POST',
                headers: { accept: 'application/json', 'content-type': 'application/json' },
                body: JSON.stringify({
                    id: 1,
                    jsonrpc: '2.0',
                    method: 'alchemy_getAssetTransfers',
                    params: [
                        {
                            contractAddresses: [`${contract}`],
                            category: ['erc721'],
                            withMetadata: true,
                            maxCount: '0x1',
                            order: 'desc',
                            fromAddress: '0x0000000000000000000000000000000000000000',
                        },
                    ],
                }),
            };

            const burnResp = await fetch(tnxUrl, options);

            if (burnResp.ok) {
                const result = await burnResp.json();
                console.log(`This is the tokenId: ${result.result.transfers[0].tokenId}`);
                // console.log(result.result.transfers);
                const tknId = result.result.transfers[0].tokenId;

                console.log(`Uses this tokenId: ${tknId} and look up the NFT itself`);
                const nftOptions = { method: 'GET', headers: { accept: 'application/json' } };
                const nftMeta = await fetch(`${nftURL}/getNFTMetadata?contractAddress=${contract}&tokenId=${tknId}&refreshCache=false`, nftOptions)

                if (nftMeta.ok) {
                    const metaDataResult = await nftMeta.json();
                    console.log('uses the data from the NFT and prints name and image');
                    console.log(metaDataResult.metadata.name);
                    console.log(metaDataResult.metadata.image);
                    const collectionData = metaDataResult.metadata;
                    return collectionData;
                }
            }
        }

    },












