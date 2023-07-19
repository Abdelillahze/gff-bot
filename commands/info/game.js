const pixelatedImage = require("../../utils/pixelateImage");
const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const axios = require("axios");
const Game = require("../../utils/Game");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("reply with game")
    .addIntegerOption((option) =>
      option
        .setName("players")
        .setDescription("set players number")
        .setRequired(true)
        .setMinValue(4)
        .setMaxValue(10)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    try {
      const slots = interaction.options.getInteger("players");
      const players = [];

      const buttons = Array.from({ length: slots }, (e, i) => {
        const button = new ButtonBuilder()
          .setCustomId(`${i + 1}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Secondary);

        return button;
      });
      const rows = Array.from({ length: Math.ceil(slots / 5) }, (e, i) => {
        const start = i * 5;
        const slicedButtons = buttons.slice(start, start + 5);
        const row = new ActionRowBuilder().addComponents(...slicedButtons);

        return row;
      });

      await interaction.reply({
        content: "slm",
        components: [...rows],
      });
      const collector = interaction.channel.createMessageComponentCollector({
        max: slots,
        time: 30000,
      });

      collector.on("collect", async (i) => {
        const author = i.user.username;
        players.push(i.user);

        rows.forEach((row) => {
          const button = row.components.find(
            (button) => button.data.custom_id === i.customId
          );

          if (button) {
            button.setDisabled(true).setLabel(author);
          }
        });

        await i.update({ content: "slm", components: [...rows] });
      });

      const timeOut = setTimeout(async () => {
        start();
      }, 60000);

      collector.on("end", async () => {
        const start = async () => {
          for (const player of data) {
            const filter = (m) => m.author.id !== player.id;
            const [word, img] = player.data;
            const pixelImg = await pixelatedImage(img, 100);
            const attachment = new AttachmentBuilder(pixelImg, {
              name: "image.png",
            });

            const msg = await interaction.channel.send({
              content: `by <@${player.id}>`,
              files: [attachment],
            });

            const collector = interaction.channel.createMessageCollector({
              filter,
              time: 60000,
            });

            setTimeout(async () => {
              const pixelImg = await pixelatedImage(img, 75);
              const attachment = new AttachmentBuilder(pixelImg, {
                name: "image.png",
              });

              msg.edit({ files: [attachment] });
            }, 10000);
            setTimeout(async () => {
              const pixelImg = await pixelatedImage(img, 50);
              const attachment = new AttachmentBuilder(pixelImg, {
                name: "image.png",
              });

              msg.edit({ files: [attachment] });
            }, 20000);
            setTimeout(async () => {
              const pixelImg = await pixelatedImage(img, 25);
              const attachment = new AttachmentBuilder(pixelImg, {
                name: "image.png",
              });

              msg.edit({ files: [attachment] });
            }, 30000);
            setTimeout(async () => {
              const attachment = new AttachmentBuilder(img, {
                name: "image.png",
              });

              msg.edit({ files: [attachment] });
            }, 40000);

            // pauser

            await new Promise((resolve, reject) => {
              collector.on("collect", (message) => {
                let earnedPoints = 0;
                const authorId = message.author.id;
                const guess = message.content;

                if (guess.toLowerCase() === word.toLowerCase()) {
                  earnedPoints = 15;
                  message.reply(`correct +${earnedPoints}pts`);
                }

                data = data.map((player) => {
                  if (player.id === authorId) {
                    return { ...player, points: player.points + earnedPoints };
                  } else {
                    return player;
                  }
                });

                if (earnedPoints === 15) {
                  resolve(true);
                }
              });

              collector.on("end", () => {
                resolve(true);
              });
            });
          }
          const sortedPlayers = data.sort((a, b) => {
            if (a.points < b.points) {
              return 1;
            } else if (a.points > b.points) {
              return -1;
            } else {
              return 0;
            }
          });
          await interaction.channel.send({
            content: `${sortedPlayers
              .map((player, i) => {
                return `#${i + 1} <@${player.id}>: ${player.points}`;
              })
              .join("\n")}`,
          });
        };
        let data = [];

        players.forEach(async (player) => {
          const playerInput = {
            id: player.id,
            name: player.username,
            points: 0,
            data: [],
          };
          const msg = await player.send("Collector is started");

          const collector = msg.channel.createMessageCollector({
            max: 2,
            time: 40000,
          });

          collector.on("collect", async (message) => {
            if (message.content === "") {
              const [attachment] = message.attachments.values();
              playerInput.data.push(attachment.attachment);
            } else {
              playerInput.data.push(message.content);
            }
          });

          collector.on("end", async () => {
            data.push(playerInput);
            if (data.length === players.length) {
              start();
              clearTimeout(timeOut);
            }
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
