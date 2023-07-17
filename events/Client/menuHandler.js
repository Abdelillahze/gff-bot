const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === "select") {
      let choices = "";
      const authorId = interaction.message.interaction.user.id;
      const userId = interaction.user.id;

      await interaction.values.forEach(async (value) => {
        choices += `${value}`;
      });

      if (authorId === userId) {
        return await interaction.message.edit({
          content: `tfdl s7bi \nhttps://www.youtube.com/watch?v=${choices}`,
          components: [],
        });
      } else {
        return await interaction.reply({
          content: `You can't access this`,
          ephemeral: true,
        });
      }
    }
  },
};
