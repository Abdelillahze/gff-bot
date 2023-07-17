const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply with pong"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    return interaction.reply("Pong");
  },
};
