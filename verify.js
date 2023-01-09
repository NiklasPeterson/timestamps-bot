const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder } = require('discord.js');
const { Captcha } = require('captcha-canvas');

module.exports = async (client) => {

	client.on('interactionCreate', async (interaction) => {

		const verifyRole = interaction.guild.roles.cache.get('941311574306586644');

		if (interaction.isButton()) {
			if (interaction.customId == 'verifyBtn') {
				// let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
				if (!verifyRole) {
					return interaction.reply({
						content: 'verifyRole is not found',
						ephemeral: true,
					});
				}
				else if (interaction.member.roles.cache.has(verifyRole.id)) {
					// If the user already has the Verified Role
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setTitle('You\'re already verified!'),
						],
						ephemeral: true,
					});
				}
				else {
					// if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) {
					//   // If bot donsn't have permission to Manage Roles
					//   return interaction.reply({
					//     content: 'I don't have perms',
					//     ephemeral: true,
					//   });
					// }

					const captcha = new Captcha(480, 240);

					// creatings captcha
					captcha.async = true;
					captcha.addDecoy();
					captcha.drawCaptcha({ size: 40 });
					captcha.drawTrace();

					const captchaImage = new AttachmentBuilder(await captcha.png, { name: 'captcha.png' });

					const enterBtnRow = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId('openModal')
							.setLabel('Enter')
							.setStyle('Success'),
					]);

					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor('#ffffff')
								.setTitle('Captcha Verification')
								.setDescription(`Please press the **Enter** button below and submit the captcha code.

**PS. The captcha is Case Sensitive.**`)
								.setImage('attachment://captcha.png')
								.setFooter({ text: 'You have 60 seconds to complete the captcha' }),

						],
						files: [captchaImage],
						components: [enterBtnRow],
						ephemeral: true,
					});

					// Get the Modal Submit Interaction that is emitted once the User submits the Modal
					const submitted = await interaction.awaitModalSubmit({
						// Timeout after a minute of not receiving any valid Modals
						time: 60000,
						// Make sure we only accept Modals from the User who sent the original Interaction we're responding to
						filter: i => i.user.id === interaction.user.id,
					}).catch(error => {
						// Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
						console.error(error);
						return null;
					});

					// If we got our Modal, we can do whatever we want with it down here.
					if (submitted) {
						// const [ age, name ] = Object.keys(fields).map(key => submitted.fields.getTextInputValue(fields[key].customId))
						const response = submitted.fields.getTextInputValue('captcha-input');

						const isValid = response == captcha.text;
						let captchaMessage = new EmbedBuilder();
						// If the user enters correct captcha

						if (isValid) {
							captchaMessage = new EmbedBuilder()
								.setColor('#ffffff')
								.setTitle('🎉 You Successfully verified yourself!')
								.setDescription('You now have access to this server!');
							await interaction.member.roles.add(verifyRole).catch((error) => {
								console.error(error);
							});
						}
						// If the user enters wrong captcha
						else {
							captchaMessage = new EmbedBuilder()
								.setColor('#ffffff')
								.setTitle('💀 You\'ve failed the verification.')
								.setDescription('You entered the the wrong captcha... Please try again.');
							// interaction.member.kick().catch((e) => { });
						}

						interaction.editReply({
							content: 'Anwser collected.',
							embeds: [],
							files: [],
							components: [],
							ephemeral: true,
						});

						submitted.reply({
							embeds: [captchaMessage],
							ephemeral: true,
						});

					}
					else {
						interaction.editReply({
							embeds: [
								new EmbedBuilder()
									.setColor('#ffffff')
									.setTitle('⏱ You\'ve failed the verification.')
									.setDescription('You took too long to complete the captcha... Please try again.'),
							],
							files: [],
							components: [],
							ephemeral: true,
						});
					}

				}
			}

			if (interaction.customId === 'openModal') {
				// Create the modal
				const modal = new ModalBuilder()
					.setCustomId('captcha-modal')
					.setTitle('Verify yourself')
					.addComponents([
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('captcha-input')
								.setLabel('Enter Captcha')
								.setStyle('Short')
								.setMinLength(6)
								.setPlaceholder('ABCDEF')
								.setRequired(true),
						),
					]);

				// Show the Modal to the User in response to the Interaction
				await interaction.showModal(modal);
			}

		}

	});

};