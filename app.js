const fs = require("fs");

const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

const { TOKEN } = process.env;

fs.readdirSync("./handlers").forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// client.on(Events.MessageCreate, () => {
//   console.log("ahla");
// });

client.login(TOKEN);
