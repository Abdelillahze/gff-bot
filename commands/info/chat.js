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
    .setName("chat")
    .setDescription("chat with Ai")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("what do you want")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const message = interaction.options.getString("message");
    const req = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
            name: interaction.user.username,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const res = await req.data;
    const thread = await interaction.channel.threads.create({
      name: res.object,
    });
    thread.send(`<@${interaction.user.id}> ${res.choices[0].message.content}`);
    await interaction.reply({ content: "Go to thread", ephemeral: true });

    client.on("messageCreate", async (msg) => {
      let messages = [{ role: "user", content: message }];
      if (msg.channel.id !== thread.id) return;
      if (msg.author.bot) return;
      messages.push({
        role: "user",
        content: msg.content,
        name: msg.author.username,
      });
      try {
        const req = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );
        const res = await req.data;

        msg.reply({ content: res.choices[0].message.content });
      } catch (err) {
        console.log(err.response.data.error);
        msg.reply(`wait...`);
      }
    });
  },
};
