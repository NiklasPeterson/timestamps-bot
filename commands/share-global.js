const { SlashCommandBuilder } = require('discord.js');

const timezones = [
  { name: 'UTC', value: 'Z' },
  { name: 'US Eastern Time (EST)', value: '-05:00' },
  { name: 'US Eastern Daylight Time (EDT)', value: '-04:00' },
  { name: 'US Central Time (CST)', value: '-06:00' },
  { name: 'US Central Daylight Time (CDT)', value: '-05:00' },
  { name: 'US Mountain Time (MST)', value: '-07:00' },
  { name: 'US Mountain Daylight Time (MDT)', value: '-06:00' },
  { name: 'US Pacific Time (PST)', value: '-08:00' },
  { name: 'US Pacific Daylight Time (PDT)', value: '-07:00' },
  { name: 'British Summer Time (BST)', value: '+01:00' },
  { name: 'Greenwich Mean Time (GMT)', value: 'Z' },
  { name: 'Central European Time (CET)', value: '+01:00' },
  { name: 'Central European Summer Time (CEST)', value: '+02:00' },
  { name: 'Eastern European Time (EET)', value: '+02:00' },
  { name: 'Eastern European Summer Time (EEST)', value: '+03:00' },
  { name: 'Moscow Standard Time (MSK)', value: '+03:00' },
  { name: 'India Standard Time (IST)', value: '+05:30' },
  { name: 'China Standard Time (CST)', value: '+08:00' },
  { name: 'Japan Standard Time (JST)', value: '+09:00' },
  { name: 'Australian Eastern Standard Time (AEST)', value: '+10:00' },
  { name: 'Australian Eastern Daylight Time (AEDT)', value: '+11:00' },
  { name: 'New Zealand Standard Time (NZST)', value: '+12:00' },
  { name: 'New Zealand Daylight Time (NZDT)', value: '+13:00' },
  { name: 'Hawaii-Aleutian Standard Time (HST)', value: '-10:00' },
  { name: 'Alaska Standard Time (AKST)', value: '-09:00' },
  { name: 'Alaska Daylight Time (AKDT)', value: '-08:00' },
  { name: 'Atlantic Standard Time (AST)', value: '-04:00' },
  { name: 'Atlantic Daylight Time (ADT)', value: '-03:00' },
  { name: 'Brazil Standard Time (BRT)', value: '-03:00' },
  { name: 'Argentina Standard Time (ART)', value: '-03:00' },
  { name: 'West Africa Time (WAT)', value: '+01:00' },
  { name: 'South Africa Standard Time (SAST)', value: '+02:00' },
  { name: 'Arabia Standard Time (AST)', value: '+03:00' },
  { name: 'Pakistan Standard Time (PKT)', value: '+05:00' },
  { name: 'Bangladesh Standard Time (BST)', value: '+06:00' },
  { name: 'Indochina Time (ICT)', value: '+07:00' },
  { name: 'Philippine Standard Time (PST)', value: '+08:00' },
  { name: 'Korea Standard Time (KST)', value: '+09:00' },
  { name: 'Australian Central Standard Time (ACST)', value: '+09:30' },
  { name: 'Australian Central Daylight Time (ACDT)', value: '+10:30' },
  { name: 'Australian Western Standard Time (AWST)', value: '+08:00' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('share')
    .setDescription('Share a timestamp in your current channel')
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
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Time in HH:MM format')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('timezone')
        .setDescription('Your timezone')
        .setRequired(true)
        .setAutocomplete(true))
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
        ))
    .addIntegerOption(option =>
      option.setName('year')
        .setDescription('Year (defaults to current year)')
        .setRequired(false)
        .setMinValue(1970)
        .setMaxValue(2100)),
  async execute(interaction) {
    const day = interaction.options.getInteger('day');
    const month = interaction.options.getInteger('month');
    const year = interaction.options.getInteger('year') || new Date().getFullYear();
    const time = interaction.options.getString('time');

    // Parse time
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return interaction.reply({ content: 'Invalid time format. Please use HH:MM (24-hour format).', ephemeral: true });
    }

    const timezone = interaction.options.getString('timezone');

    // Create Date object and get Unix timestamp
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const offsetMinutes = parseInt(timezone.slice(1, 3)) * 60 + parseInt(timezone.slice(4));
    date.setMinutes(date.getMinutes() - (timezone.startsWith('-') ? -offsetMinutes : offsetMinutes));
    
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    if (isNaN(unixTimestamp)) {
      return interaction.reply({ content: 'Invalid date. Please check your input.', ephemeral: true });
    }

    const format = interaction.options.getString('format') || 'f';
    const formattedTimestamp = `<t:${unixTimestamp}:${format}>`;

    await interaction.reply(formattedTimestamp);
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = timezones.filter(choice => choice.name.toLowerCase().includes(focusedValue));
    await interaction.respond(
      filtered.map(choice => ({ name: choice.name, value: choice.value })).slice(0, 25)
    );
  },
};