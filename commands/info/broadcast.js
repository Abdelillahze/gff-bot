const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("broadcast")
    .setDescription("send message to all members")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("message to all users")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("mention").setDescription("add mention in the message")
    )
    .addBooleanOption((option) =>
      option
        .setName("presences")
        .setDescription("only sent to the online users")
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    let sended = 0;
    const message = interaction.options.getString("message");
    const withMention = interaction.options.getBoolean("mention");
    const withPresences = interaction.options.getBoolean("presences");
    const members = await interaction.guild.members
      .fetch({ withPresences: true })
      .then((fetchedMembers) => {
        if (withPresences) {
          return fetchedMembers.filter(
            (member) => member.presence?.status === "online"
          );
        }
        return fetchedMembers;
      });

    members.each((member) => {
      const content = `${message}\n${
        withMention ? `<@${member.user.id}>` : ""
      } `;
      member.user.send({ content }).catch((err) => console.log(err));
      sended++;
    });

    return interaction.reply({
      content: `Success✅, sent to ${sended} user`,
      ephemeral: true,
    });
  },
};
