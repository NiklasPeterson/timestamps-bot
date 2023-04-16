const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {

	client.on('interactionCreate', async (interaction) => {

		// define roles needed for interaction
		const allowlistRole = interaction.guild.roles.cache.get('1005588924061712445');
		const alphaRole = interaction.guild.roles.cache.get('1005588833850638356');
		const securityRole = interaction.guild.roles.cache.get('1006973161683816558');
		const scamRole = interaction.guild.roles.cache.get('1022877110584492095');

		if (interaction.isButton()) {

			if (interaction.customId == 'allowlistBtn') {
				if (interaction.member.roles.cache.has(allowlistRole.id)) {
					await interaction.member.roles.remove(allowlistRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						content: 'Removed Allowlist Alert role',
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Removed <@&' + allowlistRole + '>')],
						ephemeral: true,
					});
				}
				else {
					await interaction.member.roles.add(allowlistRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Added <@&' + allowlistRole + '>')],
						ephemeral: true,
					});
				}
			}

			if (interaction.customId == 'alphaBtn') {
				if (interaction.member.roles.cache.has(alphaRole.id)) {
					await interaction.member.roles.remove(alphaRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Removed <@&' + alphaRole + '>')],
						ephemeral: true,
					});
				}
				else {
					await interaction.member.roles.add(alphaRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Added <@&' + alphaRole + '>')],
						ephemeral: true,
					});
				}
			}

			if (interaction.customId == 'securityBtn') {
				if (interaction.member.roles.cache.has(securityRole.id)) {
					await interaction.member.roles.remove(securityRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Removed <@&' + securityRole + '>')],
						ephemeral: true,
					});
				}
				else {
					await interaction.member.roles.add(securityRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Added <@&' + securityRole + '>')],
						ephemeral: true,
					});
				}
			}

			if (interaction.customId == 'scamBtn') {
				if (interaction.member.roles.cache.has(scamRole.id)) {
					await interaction.member.roles.remove(scamRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Removed <@&' + scamRole + '>')],
						ephemeral: true,
					});
				}
				else {
					await interaction.member.roles.add(scamRole).catch((error) => {
						console.error(error);
					});
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setDescription('Added <@&' + scamRole + '>')],
						ephemeral: true,
					});
				}
			}

		}

	});

};