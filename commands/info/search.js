const { default: axios } = require("axios");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("search for videos")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("searching query")
        .setRequired(true)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const query = interaction.options.getString("query");
    const res = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCK9OebIM0mH94lqIbWSgkEQ&maxResults=50&q=${query}&type=video&key=${process.env.API_KEY}`
    );
    const videos = await res.data.items;

    if (videos.length === 0) {
      return interaction.reply({ content: "No Results", ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("backward")
        .setLabel("⬅")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("forward")
        .setLabel("➡")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("drop")
        .setLabel("👁‍🗨")
<<<<<<< HEAD
        .setStyle(ButtonStyle.Success)
=======
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("delete")
        .setLabel("🗑")
        .setStyle(ButtonStyle.Danger)
>>>>>>> d1dc8c5 (ahla)
    );

    if (videos.length === 1) {
      row.components
        .find((button) => button.data.custom_id === "forward")
        .setDisabled(true);
    }

    const {
      title,
      description,
      thumbnails: {
        medium: { url },
      },
    } = videos[0].snippet;
    const videoId = videos[0].id.videoId;
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setURL(`https://www.youtube.com/watch?v=${videoId}`)
      .setImage(url)
      .setDescription(description || "no description")
      .setFooter({ text: `Page (${1}/${videos.length})` });

    await interaction.reply({ embeds: [embed], components: [row] });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 30000,
    });
    let counter = 0;

    collector.on("collect", async (i) => {
      if (i.customId === "forward") {
        counter++;
        const {
          title,
          description,
          thumbnails: {
            medium: { url },
          },
        } = videos[counter].snippet;
        const videoId = videos[counter].id.videoId;

        embed
          .setTitle(title)
          .setURL(`https://www.youtube.com/watch?v=${videoId}`)
          .setImage(url)
          .setDescription(description || "no description")
          .setFooter({ text: `Page (${counter + 1}/${videos.length})` });
      }
      if (i.customId === "drop") {
        return await i.update({
          content: `https://www.youtube.com/watch?v=${videos[counter].id.videoId}`,
          embeds: [],
          components: [],
        });
      }
<<<<<<< HEAD
=======

      if (i.customId === "delete") {
        return await i.message.delete();
      }

>>>>>>> d1dc8c5 (ahla)
      if (i.customId === "backward") {
        counter--;
        const {
          title,
          description,
          thumbnails: {
            medium: { url },
          },
        } = videos[counter].snippet;
        const videoId = videos[counter].id.videoId;
        embed
          .setTitle(title)
          .setURL(`https://www.youtube.com/watch?v=${videoId}`)
          .setImage(url)
          .setDescription(description || "no description")
          .setFooter({ text: `Page (${counter + 1}/${videos.length})` });
      }

      if (counter + 1 === videos.length) {
        row.components
          .find((button) => button.data.custom_id === "forward")
          .setDisabled(true);
      } else {
        row.components
          .find((button) => button.data.custom_id === "forward")
          .setDisabled(false);
      }
      if (counter === 0) {
        row.components
          .find((button) => button.data.custom_id === "backward")
          .setDisabled(true);
      } else {
        row.components
          .find((button) => button.data.custom_id === "backward")
          .setDisabled(false);
      }

      await i.update({ embeds: [embed], components: [row] });
    });
  },
};
