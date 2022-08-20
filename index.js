const { Client } = require("discord.js");

const dotenv = require('dotenv');
dotenv.config();

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

client.on("ready", async () => {
  console.log(`${client.user.tag} is Online!`);

  let guild = client.guilds.cache.get(GUILD_ID);
  if (guild) {
    guild.commands.set([
      {
        name: "setup",
        description: `Setup the verification system`,
        type: "CHAT_INPUT",
      },
    ]);
  }
  // loading
  require("./verify")(client);
});

client.login(TOKEN);