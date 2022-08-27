const { Client, Collection } = require("discord.js");
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');

const fs = require('node:fs');
const path = require('node:path');

const dotenv = require('dotenv')
// import config IDs
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const client = new Client({
  intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
});

// Fetching all files in events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Fetching all files in commands folder
// Creating a collection for commands in client
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// on Interaction logic
client.on('interactionCreate', async interaction => {
	if (!interaction.isApplicationCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("ready", async () => {
  console.log(`${client.user.tag} is now online!`);
		client.user.setActivity('you...', {
			type: 'WATCHING'
		})

  // Registering the commands in the client
  const rest = new REST({
    version: '9'
  }).setToken(TOKEN);
  (async () => {
    try {
      if (GUILD_ID == "global") {
        await rest.put(
          Routes.applicationCommands(CLIENT_ID), {
          body: commands
        },
        );
        console.log('Successfully registered application commands globally');
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
          body: commands
        },
        );
        console.log('Successfully registered application commands for development guild');
      }
    } catch (error) {
      if (error) console.error(error);
    }
  })();

  require("./verify")(client);
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.login(TOKEN);