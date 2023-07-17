const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Create images by imaging")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("imagine a thing")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.reply("9ar3 yzbi...");
    try {
      const prompt = interaction.options.getString("prompt");
      const req = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt,
          n: 1,
          size: "512x512",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      const res = await req.data;
      const images = new AttachmentBuilder(res.data[0].url, {
        name: "imagine1.png",
      });
      return await interaction.editReply({ content: "hak", files: [images] });
    } catch (err) {
      console.log(err);
      return await interaction.editReply("Error");
    }
  },
};
