const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, Modal, TextInputComponent, } = require("discord.js");
const { Captcha } = require("captcha-canvas");

const WELCOME_CHANNEL_ID='940694894207447070'
const VERIFIED_ROLE_ID='941311574306586644'

module.exports = async (client) => {

  client.on("interactionCreate", async (interaction) => {

    // Hard coded values for now
    let verifyChannel = interaction.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);

    if (interaction.isCommand()) {
      if (interaction.commandName == "setup") {
        if (!interaction.member.permissions.has("MANAGE_ROLES")) {
          return interaction.reply({
            content: `You don't have perms to run command`,
            ephemeral: true,
          });
        }

        if (!verifyChannel || !verifyRole) {
          return interaction.reply({
            content: `verifyChannel and verifyRole is not found`,
            ephemeral: true,
          });
        } else {
          let embed = new MessageEmbed()
            // .setFooter("Verification Period: 1 minutes")
            .setColor("WHITE")
            .setTitle(`Gatekeeper of ${interaction.guild.name}`)
            .setDescription(`Welcome to ${interaction.guild.name}! To get access to this server verify that you arent a bot by completing the captcha.

            **Click the button below to get started.**`)

          let btnRow = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`verifyBtn`)
              .setLabel("Verify")
              .setStyle("SUCCESS"),
          ]);

          await verifyChannel.send({
            embeds: [embed],
            components: [btnRow],
          });

          interaction.reply({
            content: `Verification System Setup in ${verifyChannel} and Verify Role is ${verifyRole}`,
            ephemeral: true,
          });
        }
      } else {
        interaction.reply({
          content: `${interaction.commandName} is not valid`,
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId == "verifyBtn") {
        let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
        if (!verifyRole) return;

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

          // Create a captcha for the user who presses the Verify button
          const captcha = new Captcha();
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
                .setTitle(`💀 You have failed the verification.`)
                .setDescription(`You entered the the wrong captcha... Please try again.`)
              // interaction.member.kick().catch((e) => { });
            }

          await submitted.reply({
            content: `You submitted: ${response} and its ${isValid} ${captcha.text}`,
            embeds: [captchaMessage],
            ephemeral: true
          })
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
        
        // Show the Modal to the User in response to the Interaction
        await interaction.showModal(modal)

      }
    }

  });

};
