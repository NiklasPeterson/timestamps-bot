const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, Modal, TextInputComponent, } = require("discord.js");
const { Captcha } = require("captcha-canvas");

let captcha;

module.exports = async (client) => {

  client.on("interactionCreate", async (interaction) => {
    
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

            captcha = new Captcha();

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
                  .setImage(`attachment://captcha.png`),
              ],
              files: [captchaImage],
              components: [enterBtnRow],
              ephemeral: true,
            });
          }
        }
      }

      if (interaction.customId === 'enter') {
        // Create the modal
        const modal = new Modal()
          .setCustomId('captcha-modal')
          .setTitle('Verify yourself')
          // Add components to modal
          .addComponents([
            new MessageActionRow().addComponents(
              // Create the text input components
              new TextInputComponent()
                // ID is what we use to target our input
                .setCustomId('captcha-input')
                // The label is the prompt the user sees for this input
                .setLabel('Enter Captcha')
                // Short means only a single line of text
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

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'captcha-modal') {
        const response = interaction.fields.getTextInputValue('captcha-input');

        let isValid = response == captcha.text;
        // If the user enters wrong captcha
        if (isValid) {
          await interaction.member.roles.add(verifyRole).catch((e) => { });
          interaction.reply({
            content: `🎉 You have verified! Now you have got access of this server!`,
            ephemeral: true,
          });
        }
        // If the user enters wrong captcha
        else {
          let wrongCaptcha = new MessageEmbed()
            .setColor("#ffffff")
            .setTitle(`💀 You have failed the verification.`)
            .setDescription(`You were kicked from \`${interaction.guild.name}\`, because entered the wrong captcha...`)
          await interaction.user.send({
            embeds: [wrongCaptcha],
          });
          // interaction.member.kick().catch((e) => { });
        }

      }
    }
  });

};