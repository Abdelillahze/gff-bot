const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log("Ready!");
    client.user.setActivity("with mamak", { type: ActivityType.Playing });
  },
};
