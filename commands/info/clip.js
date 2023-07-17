const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clip")
    .setDescription("Manage and receive clips")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("new")
        .setDescription("get new clip")
        .addBooleanOption((option) =>
          option
            .setName("thread")
            .setDescription("whether or not the thread should be added")
        )
    )
    .addSubcommand((subCommand) =>
      subCommand.setName("search").setDescription("search for clips")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const thread = interaction.options.getBoolean("thread");
    const res = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLRMKhewoy5PTfk0Vlm9IQ9QM4dE3ty_DP&key=${process.env.API_KEY}`
    );
    const videoIds = await res.data.items.map(
      (item) => item.snippet.resourceId.videoId
    );
    const options = await res.data.items.map((item) => ({
      label: item.snippet.title,
      description: item.snippet.description || "no description",
      value: item.snippet.resourceId.videoId,
    }));

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("select")
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder(`Nothing Selected`)
        .addOptions(...options)
    );

    switch (sub) {
      case "new": {
        const url = `https://www.youtube.com/watch?v=${videoIds.at(-1)}`;
        await interaction.reply({
          content: `tfadal hhh \n${url}`,
        });
        if (thread) {
          (await interaction.fetchReply()).startThread({ name: "discussion" });
        }
        return;
      }
      case "search": {
        interaction.authorMessage = interaction.user.id;
        return await interaction.reply({
          content: "Select Clip",
          components: [menu],
        });
      }
    }
  },
};
