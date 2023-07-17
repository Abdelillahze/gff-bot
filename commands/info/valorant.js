const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valorant")
    .setDescription("get valorant info")
    .addSubcommand((subCommand) =>
      subCommand
        .setName("user")
        .setDescription("get user info")
        .addStringOption((option) =>
          option.setName("name").setDescription("add your valorant name")
        )
        .addStringOption((option) =>
          option.setName("tag").setDescription("add your valorant tag")
        )
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");
    const res = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`
    );
    const data = await res.data.data;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("userData")
        .setLabel("more data")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("lastMatch")
        .setLabel("last Match")
        .setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle(`${data.name}#${data.tag}`)
      .setThumbnail(data.card.small)
      .setFields(
        {
          name: "lvl",
          value: `${data.account_level}`,
          inline: true,
        },
        {
          name: "region",
          value: `${data.region}`,
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      resolveBody: { data },
    });

    const filter = (i) => i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "userData") {
        const { region, name, tag } = data;
        const res = await axios.get(
          `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${name}/${tag}`
        );
        const {
          currenttierpatched: rank,
          images: { small: rankImg },
        } = res.data.data;
        embed
          .setFields(
            { name: "rank", value: rank, inline: true },
            {
              name: "lvl",
              value: `${data.account_level}`,
              inline: true,
            },
            {
              name: "region",
              value: `${data.region}`,
              inline: true,
            }
          )
          .setImage(rankImg);

        row.components
          .find((button) => button.data.custom_id === "userData")
          .setDisabled(true);

        await i.update({ embeds: [embed], components: [row] });
      }

      if (i.customId === "lastMatch") {
        const { region, name, tag } = data;
        const res = await axios.get(
          `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${name}/${tag}`
        );
        const matchesData = await res.data.data.map((match) => {
          const { kills, deaths, assists } = match.players.all_players.find(
            (player) => player.name === name
          ).stats;
          return {
            map: match.metadata.map,
            mode: match.metadata.mode,
            stats: `${kills}/${deaths}/${assists}`,
          };
        });
        embed
          .setTitle("Last Match")
          .setFields(
            { name: "Your Stats", value: matchesData[0].stats, inline: true },
            { name: "map", value: matchesData[0].map, inline: true },
            { name: "mode", value: matchesData[0].mode, inline: true }
          )
          .setImage();

        await i.update({ embeds: [embed], components: [row] });
      }
    });

    collector.on("end", (collected) =>
      console.log(`Collected ${collected.size} items`)
    );
  },
};
