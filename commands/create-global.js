const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a timestamp snippet (Private)')
    .addIntegerOption(option =>
      option.setName('day')
        .setDescription('Day of the month')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31))
    .addIntegerOption(option =>
      option.setName('month')
        .setDescription('Month (1-12)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12))
    .addIntegerOption(option =>
      option.setName('year')
        .setDescription('Year')
        .setRequired(true)
        .setMinValue(1970)
        .setMaxValue(2100))
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Time in HH:MM format')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('format')
        .setDescription('Timestamp format')
        .setRequired(false)
        .addChoices(
          { name: 'Short Time (e.g., 9:41 PM)', value: 't' },
          { name: 'Long Time (e.g., 9:41:30 PM)', value: 'T' },
          { name: 'Short Date (e.g., 13/06/2024)', value: 'd' },
          { name: 'Long Date (e.g., 13 June 2024)', value: 'D' },
          { name: 'Short Date/Time (e.g., 13 June 2024 9:41 PM)', value: 'f' },
          { name: 'Long Date/Time (e.g., Wednesday, 13 June 2024 9:41 PM)', value: 'F' },
          { name: 'Relative Time (e.g., in 8 hours / 2 months ago)', value: 'R' }
        )),
  async execute(interaction) {
    const day = interaction.options.getInteger('day');
    const month = interaction.options.getInteger('month');
    const year = interaction.options.getInteger('year');
    const time = interaction.options.getString('time');

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return interaction.reply({ content: 'Invalid time format. Please use HH:MM (24-hour format).', ephemeral: true });
    }

    // Create Date object and get Unix timestamp
    const date = new Date(year, month - 1, day, hours, minutes);
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    const format = interaction.options.getString('format') || 'f';
    const formattedTimestamp = `<t:${unixTimestamp}:${format}>`;

    await interaction.reply({
      content: `Preview: ${formattedTimestamp}\n\`\`\`${formattedTimestamp}\`\`\`Copy and paste the above snippet where needed.`,
      ephemeral: true
    });

  },
};