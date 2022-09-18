const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, Modal, TextInputComponent, } = require("discord.js");
const { Captcha } = require("captcha-canvas");


module.exports = async (client) => {

  client.on("interactionCreate", async (interaction) => {

    // let verifyRole = interaction.guild.roles.cache.get("995436042545004645");

    if (interaction.isButton()) {
      if (interaction.customId == "verifyBtn") {
        // let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
        if (!verifyRole) {
          return interaction.reply({
            content: `verifyRole is not found`,
            ephemeral: true,
          });
        } else {
          if (interaction.member.roles.cache.has(verifyRole.id)) {
            // If the user already has the Verified Role
            return interaction.reply({
              content: `You are already verified`,
              ephemeral: true,
            });
          } else {
            if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
              // If bot donsn't have permission to Manage Roles
              return interaction.reply({
                content: `I don't have perms`,
                ephemeral: true,
              });
            }
            
            const captcha = new Captcha();

            // creatings captcha
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            const captchaImage = new MessageAttachment(
              await captcha.png,
              "captcha.png"
            );

            let enterBtnRow = new MessageActionRow().addComponents([
              new MessageButton()
                .setCustomId(`enter`)
                .setLabel("Enter")
                .setStyle("SUCCESS"),
            ]);

            await interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("WHITE")
                  .setTitle(`Captcha Verification`)
                  .setDescription(`Please send the captcha code here.
                Hello! You are required to complete a captcha before entering the server.
                **NOTE:** **This is Case Sensitive.**

                **Why?**
                This is to protect the server against
                targeted attacks using automated user accounts.

                **Your Captcha:**`)
                  .setImage(`attachment://captcha.png`)
                  .setFooter({ text: 'You have 60 seconds to enter the captcha' }),
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
              console.error(error)
              return null
            })

            // If we got our Modal, we can do whatever we want with it down here.
            if (submitted) {
              // const [ age, name ] = Object.keys(fields).map(key => submitted.fields.getTextInputValue(fields[key].customId))
              const response = submitted.fields.getTextInputValue('captcha-input');

              let isValid = response == captcha.text;
              let captchaMessage = new MessageEmbed()
              // If the user enters correct captcha

              if (isValid) {
                captchaMessage = new MessageEmbed()
                  .setColor("WHITE")
                  .setTitle(`🎉 You successfully verified yourself!`)
                  .setDescription(`You now have access to this server!`)
                await interaction.member.roles.add(verifyRole).catch((e) => { });
              }
              // If the user enters wrong captcha
              else {
                captchaMessage = new MessageEmbed()
                  .setColor("WHITE")
                  .setTitle(`💀 You've failed the verification.`)
                  .setDescription(`You entered the the wrong captcha... Please try again.`)
                // interaction.member.kick().catch((e) => { });
              }

              interaction.editReply({
                content: `Anwser collected.`,
                embeds: [],
                files: [],
                components: [],
                ephemeral: true
              })

              submitted.reply({
                embeds: [captchaMessage],
                ephemeral: true
              })

            } else {
              interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor("WHITE")
                    .setTitle(`⏱ You've failed the verification.`)
                    .setDescription(`You took too long to complete the captcha... Please try again.`)
                ],
                files: [],
                components: [enterBtnRow],
                ephemeral: true
              })
            }

          }
        }
      }

      if (interaction.customId === 'enter') {
        // Create the modal
        const modal = new Modal()
          .setCustomId('captcha-modal')
          .setTitle('Verify yourself')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('captcha-input')
                .setLabel('Enter Captcha')
                .setStyle('SHORT')
                .setMinLength(5)
                .setPlaceholder('ABCDEF')
                .setRequired(true),
            ),
          ]);
        // Show the modal to the user
        await interaction.showModal(modal);
      }
    }

  });

};