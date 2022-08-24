const { Client, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, Modal, TextInputComponent, } = require("discord.js");
const { Captcha } = require("captcha-canvas");

const dotenv = require('dotenv');
dotenv.config();

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;
let captcha;
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {

  client.on("interactionCreate", async (interaction) => {

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

          let cmsg = await interaction.reply({
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

          // await cmsg.channel
          //   awaitModalSubmit({
          //     filter: (m) => m.author.id == interaction.user.id,
          //     max: 1,
          //     time: 1000 * 60,
          //     errors: ["time"],
          //   })

          //   .then(async (value) => {
          //     let isValid = value.first().content == captcha.text;
          //     if (isValid) {
          //       await interaction.member.roles.add(verifyRole).catch((e) => { });
          //       interaction.user.send({
          //         content: `🎉 You have verified! Now you have got access of this server!`,
          //         ephemeral: true,
          //       });
          //     }
          //     // If the user enters wrong captcha
          //     else {
          //       await interaction.user.send({
          //         content: `💀 You're kicked from ${interaction.guild.name}! Because entered the wrong captcha...`,
          //         ephemeral: true,
          //       });
          //       interaction.member.kick().catch((e) => { });
          //     }
          //   })
          //   // If the timer goes out
          //   .catch(async (e) => {
          //     await interaction.user.send({
          //       content: `💀 You're kicked from ${interaction.guild.name}! Because you didn't manage to completed the captcha in time...`,
          //       ephemeral: true,
          //     });
          //     interaction.member.kick().catch((e) => { });
          //   });
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
        // console.log(`Yay, your answer is submitted: "${response}"`);
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
            .setColor("WHITE")
            .setTitle(`💀 You have failed the verification.`)
            .setDescription(`You were kicked from \`${interaction.guild.name}\`, because entered the wrong captcha...`)
          await interaction.user.send({
            embeds: [wrongCaptcha],
            ephemeral: true,
          });
          interaction.member.kick().catch((e) => { });
        }

      }
    }
  });

};


        // const waiting = await interaction.awaitModalSubmit({
        //   // Timeout after a minute of not receiving any valid Modals
        //   max: 1,
        //   time: 1000 * 60,
        //   errors: ["time"],
        //   // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
        //   filter: i => i.user.id === interaction.user.id,
        // }).catch(error => {
        //   // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
        //   console.error(error)
        //   await interaction.user.send({
        //     content: `💀 You're kicked from ${interaction.guild.name}! Because you didn't manage to completed the captcha in time...`,
        //     ephemeral: true,
        //   });
        //   interaction.member.kick().catch((e) => { });
        // })