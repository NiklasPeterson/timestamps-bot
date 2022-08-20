const {
  Client,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment,
} = require("discord.js");

const dotenv = require('dotenv');
dotenv.config();


const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;
const WELCOME_CHANNEL = process.env.WELCOME_CHANNEL;


const { Captcha } = require("captcha-canvas");
const captcha = new Captcha();

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  // code
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      if (interaction.commandName == "setup") {
        if (!interaction.member.permissions.has("MANAGE_ROLES")) {
          return interaction.reply({
            content: `You don't have perms to run command`,
            ephemeral: true,
          });
        }

        let verifyChannel = interaction.guild.channels.cache.get(WELCOME_CHANNEL);
        let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);

        if (!verifyChannel || !verifyRole) {
          return interaction.reply({
            content: `verifyChannel and verifyRole is not found`,
            ephemeral: true,
          });
        } else {
          let embed = new MessageEmbed()
            // .setFooter("Verification Period: 1 minutes")
            .setColor("BLURPLE")
            .setTitle(`Gatekeeper of ${interaction.guild.name}`)
            .setDescription(`Welcome to ${interaction.guild.name}! To get access to this server verify that you arent a bot by completing the captcha.

            **Click the button below to get started.**`)

          let btnRow = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId(`v_verify`)
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
      if (interaction.customId == "v_verify") {
        // code
        let verifyRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
        if (!verifyRole) return;

        if (interaction.member.roles.cache.has(verifyRole.id)) {
          return interaction.reply({
            content: `You are already verified`,
            ephemeral: true,
          });
        } else {
          if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) {
            return interaction.reply({
              content: `I don't have perms`,
              ephemeral: true,
            });
          }

          // creatings captcha
          captcha.async = true;
          captcha.addDecoy();
          captcha.drawTrace();
          captcha.drawCaptcha();

          const captchaImage = new MessageAttachment(
            await captcha.png,
            "captcha.png"
          );

          let cmsg = await interaction.user.send({
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
          });

          interaction.reply({
            content: `Hey! Please check you'r dm's i have sent you the captcha to verify yourself in this server!`,
            ephemeral: true,
          });

          await cmsg.channel
            .awaitMessages({
              filter: (m) => m.author.id == interaction.user.id,
              max: 1,
              time: 1000 * 60,
              errors: ["time"],
            })

            .then(async (value) => {
              let isValid = value.first().content == captcha.text;
              if (isValid) {
                await interaction.member.roles.add(verifyRole).catch((e) => {});
                interaction.user.send({
                  content: `🎉 You have verified! Now you have got access of this server!`,
                  ephemeral: true,
                });
              } 
              // If the user enters wrong captcha
              else {
                await interaction.user.send({
                  content: `💀 You're kicked from ${interaction.guild.name}! Because entered the wrong captcha...`,
                  ephemeral: true,
                });
                interaction.member.kick().catch((e) => {});
              }
            })
            // If the timer goes out
            .catch(async (e) => {
              await interaction.user.send({
                content: `💀 You're kicked from ${interaction.guild.name}! Because you didn't manage to completed the captcha in time...`,
                ephemeral: true,
              });
              interaction.member.kick().catch((e) => {});
            });
        }
      }
    }
  });
};
/**
 * @INFO
 * Bot Coded by iRed#1330 | https://github.com/iRed-Github/Verification-BOT
 * @INFO
 * Join iDK Development | https://dsc.gg/idk-development
 * @INFO
 * Please mention Her / iDK Development, when using this Code!
 * @INFO
 */